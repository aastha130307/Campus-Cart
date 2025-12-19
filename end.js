import {
  auth,
  db,
  doc,
  getDoc,
  signOut,
  updateDoc,
  collection,
  getDocs,
  addDoc
} from './firebase.js';

// DOMContentLoaded Event to initialize
window.addEventListener('DOMContentLoaded', () => {
  // Show a specific section
  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (sectionId === 'profileSection') {
      loadUserProfile();
    }
    if (section) section.style.display = 'block';
  }

  // Load user profile
  async function loadUserProfile() {
    const user = auth.currentUser;
    if (!user) {
      alert("You need to log in to view the profile.");
      window.location.href = 'auth.html';
      return;
    }

    try {
      const userProfileRef = doc(db, 'users', user.uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        const profileData = userProfileSnap.data();
        document.getElementById('userName').textContent = profileData.name || 'Not Provided';
        document.getElementById('userBranch').textContent = profileData.branch || 'Not Provided';
        document.getElementById('userYear').textContent = profileData.year || 'Not Provided';
        document.getElementById('userHostel').textContent = profileData.hostel || 'Not Provided';
        document.getElementById('userContact').textContent = profileData.contact || 'Not Provided';
        document.getElementById('userUpi').textContent = profileData.upi || 'Not Provided';
        document.getElementById('userEmail').textContent = user.email || 'Not Provided';
      } else {
        alert('Profile data not found.');
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      alert('Error loading profile data.');
    }
  }

  // Submit a request
  document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You must be logged in to submit a request.");
      return;
    }

    const requestedItem = document.getElementById('requestedItem').value;
    const purpose = document.getElementById('purpose').value;
    const requestDescription = document.getElementById('requestDescription').value;

    const urgencyLevel = document.getElementById('urgencyLevel').value;

    try {
      await addDoc(collection(db, 'requests'), {
        requestedItem,
        purpose,
        requestDescription,
        urgencyLevel,
        email: currentUser.email,
        userID: currentUser.uid,
        timestamp: Date.now()
      });

      alert("Request submitted successfully!");
      document.getElementById('requestForm').reset();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request. Try again.");
    }
  });

  // ✅ Submit a sell item
  document.getElementById('sellForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You must be logged in to sell an item.");
      return;
    }

    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemDescription = document.getElementById('itemDescription').value;
    
    try {
      await addDoc(collection(db, 'items'), {
        itemName,
        itemPrice,
        itemDescription,
        email: currentUser.email,
        userID: currentUser.uid,
        timestamp: Date.now()
      });

      alert("Item submitted successfully!");
      document.getElementById('sellForm').reset();
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("Error submitting item. Try again.");
    }
  });

  // Navigation buttons
  document.getElementById('sellBtn')?.addEventListener('click', () => showSection('sellSection'));
  document.getElementById('requestBtn')?.addEventListener('click', () => showSection('requestSection'));
  document.getElementById('browseBtn')?.addEventListener('click', () => {
    showSection('browseSection');
    loadBrowseSection();
  });
  document.getElementById('profileBtn')?.addEventListener('click', () => showSection('profileSection'));

  // Logout
  document.getElementById("logoutButton")?.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully.");
    document.getElementById("authSection").style.display = "block";
    document.getElementById("mainContent").style.display = "none";
  });

  // Load browse section
  async function loadBrowseSection() {
    const itemsContainer = document.getElementById('browseItemsContainer');
    const requestsContainer = document.getElementById('browseRequestsContainer');
    itemsContainer.innerHTML = '<p>Loading items...</p>';
    requestsContainer.innerHTML = '<p>Loading requests...</p>';

    try {
      const itemsSnapshot = await getDocs(collection(db, 'items'));
      itemsContainer.innerHTML = '';

      itemsSnapshot.forEach(doc => {
        const item = doc.data();
        itemsContainer.innerHTML += `
          <div class="item-card">
            <h3>${item.itemName}</h3>
            <p><strong>Price:</strong> ₹${item.itemPrice}</p>
            
            <p><strong>Description:</strong> ${item.itemDescription}</p>
            <hr/>
          </div>
        `;
      });

      const requestsSnapshot = await getDocs(collection(db, 'requests'));
      requestsContainer.innerHTML = '';

      requestsSnapshot.forEach(docSnap => {
        const request = docSnap.data();
        const requestId = docSnap.id;
        const upvotes = request.upvotes || 0;

        requestsContainer.innerHTML += `
          <div class="request-card" id="request-${requestId}">
            <h3>${request.requestedItem || "Unnamed Request"}</h3>
            <p><strong>Purpose:</strong> ${request.purpose || "Not specified"}</p>
            <p><strong>Description:</strong> ${request.requestDescription || "No description"}</p>
        
            <p><strong>Urgency:</strong> ${request.urgencyLevel || 'Not specified'}</p>
            <button class="upvoteBtn" data-id="${requestId}">⬆ Upvote (<span id="upvote-count-${requestId}">${upvotes}</span>)</button>
            <button class="ihaveitBtn" data-id="${requestId}" data-userid="${request.userID || ''}">I have it</button>
            <hr/>
          </div>
        `;
      });

      setTimeout(() => {
        document.querySelectorAll('.upvoteBtn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const requestId = btn.getAttribute('data-id');
            const requestRef = doc(db, 'requests', requestId);
            const requestSnap = await getDoc(requestRef);
            const currentVotes = requestSnap.data().upvotes || 0;

            await updateDoc(requestRef, { upvotes: currentVotes + 1 });

            document.getElementById(`upvote-count-${requestId}`).textContent = currentVotes + 1;
            btn.disabled = true;
          });
        });

        document.querySelectorAll('.ihaveitBtn').forEach(btn => {
          btn.addEventListener('click', () => {
            const requestId = btn.getAttribute('data-id');
            const requesterID = btn.getAttribute('data-userid');
            if (!requesterID) {
              alert("Requester ID not found for this request.");
              return;
            }
            window.location.href = `responderForm.html?requestId=${requestId}&requesterID=${requesterID}`;
          });
        });

      }, 300);
    } catch (err) {
      console.error("Error loading browse data:", err);
      itemsContainer.innerHTML = '<p>Failed to load items.</p>';
      requestsContainer.innerHTML = '<p>Failed to load requests.</p>';
    }
  }
});
