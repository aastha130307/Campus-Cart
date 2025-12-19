import { 
    auth, db, doc, getDoc, collection, query, where, getDocs, addDoc, onAuthStateChanged 
  } from './firebase.js';
  
  // DOM Elements
  const userNameElement = document.getElementById('userName');
  const userBranchElement = document.getElementById('userBranch');
  const userYearElement = document.getElementById('userYear');
  const userHostelElement = document.getElementById('userHostel');
  const userContactElement = document.getElementById('userContact');
  const userUpiElement = document.getElementById('userUpi');
  const myItemsContainer = document.getElementById('myItemsContainer');
  const myRequestsContainer = document.getElementById('myRequestsContainer');
  const responsesContainer = document.getElementById('responsesContainer');
  
  // Fetch user profile
  async function fetchUserProfile(userIdToFetch, isOwnProfile, isResponderProfile = false) {
    try {
      const profileSnap = await getDoc(doc(db, 'users', userIdToFetch));
      if (profileSnap.exists()) {
        const user = profileSnap.data();
        userNameElement.textContent = user.name || "Not Provided";
        userBranchElement.textContent = user.branch || "Not Provided";
        userYearElement.textContent = user.year || "Not Provided";
        userHostelElement.textContent = user.hostel || "Not Provided";
        userContactElement.textContent = user.contact || "Not Provided";
        userUpiElement.textContent = user.upi || "Not Provided";
  
        if (!isOwnProfile || isResponderProfile) {
          document.getElementById("editProfileBtn")?.style.display = "none";
          document.getElementById("logoutButton")?.style.display = "none";
          myItemsContainer.style.display = "none";
          myRequestsContainer.style.display = "none";
          responsesContainer.style.display = "none";
        }
      } else {
        alert("Profile not found.");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }
  
  // Fetch user's items
  async function fetchUserItems(userId) {
    try {
      const q = query(collection(db, 'items'), where("userID", "==", userId));
      const snapshot = await getDocs(q);
      myItemsContainer.innerHTML = '';
  
      if (snapshot.empty) {
        myItemsContainer.innerHTML = "<p>No items uploaded.</p>";
        return;
      }
  
      snapshot.forEach(doc => {
        const item = doc.data();
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <h4>${item.itemName}</h4>
          <p><strong>Price:</strong> ₹${item.itemPrice}</p>
          <p><strong>Description:</strong> ${item.itemDescription}</p>
        `;
        myItemsContainer.appendChild(div);
      });
    } catch (err) {
      console.error("Error loading items:", err);
      myItemsContainer.innerHTML = "<p>Could not load items.</p>";
    }
  }
  
  // Fetch user's requests
  async function fetchUserRequests(userId) {
    try {
      const q = query(collection(db, 'requests'), where("userID", "==", userId)); // fixed from requesterID
      const snapshot = await getDocs(q);
      myRequestsContainer.innerHTML = '';
  
      if (snapshot.empty) {
        myRequestsContainer.innerHTML = "<p>No requests made.</p>";
        return;
      }
  
      snapshot.forEach(doc => {
        const req = doc.data();
        const div = document.createElement("div");
        div.className = "request";
        div.innerHTML = `
          <h4>${req.requestedItem}</h4>
          <p><strong>Purpose:</strong> ${req.purpose}</p>
          <p><strong>Urgency:</strong> ${req.urgencyLevel}</p>
          <p><strong>Description:</strong> ${req.requestDescription}</p>
          
        `;
        myRequestsContainer.appendChild(div);
      });
    } catch (err) {
      console.error("Error loading requests:", err);
      myRequestsContainer.innerHTML = "<p>Could not load requests.</p>";
    }
  }
  
  // Fetch responses received for user's requests
  async function fetchResponses(userId) {
    try {
      const q = query(collection(db, 'responses'), where("requesterID", "==", userId));
      const snapshot = await getDocs(q);
      responsesContainer.innerHTML = '';
  
      if (snapshot.empty) {
        responsesContainer.innerHTML = "<p>No responses received yet.</p>";
        return;
      }
  
      snapshot.forEach(doc => {
        const res = doc.data();
        const div = document.createElement("div");
        div.className = "response";
        div.innerHTML = `
          <p><strong>${res.responderName}</strong> says they have your requested item.</p>
          <p>Contact: ${res.responderContact}</p>
          <button class="view-profile-btn" data-responder-id="${res.responderID}">View Profile</button>
        `;
        div.querySelector(".view-profile-btn").addEventListener("click", (e) => {
          const responderId = e.target.dataset.responderId;
          window.location.href = 'profile.html?userId=${responderId}&viewResponder=true';
        });
        responsesContainer.appendChild(div);
      });
    } catch (err) {
      console.error("Error loading responses:", err);
      responsesContainer.innerHTML = "<p>Could not load responses.</p>";
    }
  }
  
  // Add response to database (optional trigger if you plan to call this elsewhere)
  export async function handleResponderResponse(requestId, responderId, requesterId) {
    try {
      const responderSnap = await getDoc(doc(db, 'users', responderId));
      if (!responderSnap.exists()) throw new Error("Responder profile missing");
  
      const responderData = responderSnap.data();
  
      await addDoc(collection(db, 'responses'), {
        requestId,
        requesterID: requesterId,
        responderID: responderId,
        responderName: responderData.name || "Unknown",
        responderContact: responderData.contact || "N/A",
        respondedAt: new Date()
      });
  
      alert("You have successfully responded to the request!");
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Error submitting response.");
    }
  }
  
  // Button Event Listeners
  document.getElementById("editProfileBtn")?.addEventListener("click", () => {
    window.location.href = "profile-setup.html";
  });
  
  document.getElementById("logoutButton")?.addEventListener("click", async () => {
    try {
      await auth.signOut();
      window.location.href = "auth.html";
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  });
  
  document.getElementById("backToMainBtn")?.addEventListener("click", () => {
    window.location.href = "end.html";
  });
  
  // Initialize on auth change
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      const params = new URLSearchParams(window.location.search);
      const viewedUserId = params.get("userId");
      const isResponderProfile = params.get("viewResponder") === "true";
      const isOwnProfile = !viewedUserId || viewedUserId === user.uid;
      const userIdToFetch = viewedUserId || user.uid;
  
      fetchUserProfile(userIdToFetch, isOwnProfile, isResponderProfile);
  
      if (isOwnProfile) {
        fetchUserItems(userIdToFetch);
        fetchUserRequests(userIdToFetch);
        fetchResponses(userIdToFetch);
      }
    } else {
      window.location.href = "auth.html";
    }
  });