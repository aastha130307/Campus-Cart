import {
    auth,
    db,
    updateDoc,
    doc,
    getDoc,
    onAuthStateChanged,
    storage,
    ref,
    uploadBytes,
    getDownloadURL
  } from './firebase.js';
  
  // Get references to form fields
  const profileName = document.getElementById('profileName');
  const profileBranch = document.getElementById('profileBranch');
  const profileYear = document.getElementById('profileYear');
  const profileHostel = document.getElementById('profileHostel');
  const profileContact = document.getElementById('profileContact');
  const profileUpi = document.getElementById('profileUpi');
  const profilePicInput = document.getElementById('profilePicInput');
  const saveBtn = document.getElementById('saveProfileBtn');
  const profilePic = document.getElementById('profilePic');
  const feedbackMessage = document.getElementById('feedbackMessage');
  
  // Ensure user is logged in and set up profile form
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadProfile(user.uid);
    } else {
      window.location.href = 'auth.html';
    }
  });
  
  // Load existing profile data (if any)
  async function loadProfile(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      const userData = userSnap.data();
      profileName.value = userData.name || '';
      profileBranch.value = userData.branch || '';
      profileYear.value = userData.year || '';
      profileHostel.value = userData.hostel || '';
      profileContact.value = userData.contact || '';
      profileUpi.value = userData.upi || '';
      if (userData.profilePic) {
        profilePic.src = userData.profilePic;
      }
    }
  }
  
  // Save the updated profile data
saveBtn.addEventListener('click', async () => {
    const user = auth.currentUser;

    if (!user) {
        feedbackMessage.textContent = "You must be logged in to complete your profile.";
        return;
    }

    const uid = user.uid;
    const updatedData = {
        name: profileName.value.trim(),
        branch: profileBranch.value.trim(),
        year: profileYear.value,
        hostel: profileHostel.value.trim(),
        contact: profileContact.value.trim(),
        upi: profileUpi.value.trim()
    };

    try {
        // Handle profile picture upload if file is selected
        if (profilePicInput.files.length > 0) {
            const file = profilePicInput.files[0];
            const storageRef = ref(storage, 'profilePics/${uid}');
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            updatedData.profilePic = downloadURL;
        }

        // Save to Firestore
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, updatedData);

        // Redirect to end.html after saving the profile
        window.location.href = 'end.html';

    } catch (err) {
        feedbackMessage.textContent = "Error saving profile: " + err.message;
    }
});