import {
    db,
    collection,
    getDocs,
    auth,
    onAuthStateChanged,
    doc,
    getDoc,
    setDoc
  } from './firebase.js';
  
  const itemsContainer = document.getElementById("browseItemsContainer");
  const requestsContainer = document.getElementById("browseRequestsContainer");
  const itemSearchInput = document.getElementById("itemSearchInput");
  const requestSearchInput = document.getElementById("requestSearchInput");
  
  let allItems = [];
  let allRequests = [];
  
  // Handle response to a request
  async function handleResponderResponse(reqId, requesterID, currentUser) {
    if (!requesterID) {
      alert("Error: requester ID not found.");
      return;
    }
  
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
  
      const responseDocRef = doc(db, 'responses', `${reqId}_${currentUser.uid}`);
      const responseSnap = await getDoc(responseDocRef);
      if (responseSnap.exists()) {
        alert("You have already responded to this request.");
        return;
      }
  
      await setDoc(responseDocRef, {
        requestId: reqId,
        requesterID: requesterID,
        responderID: currentUser.uid,
        responderName: userData.name || "Unknown",
        responderContact: userData.contact || "",
        responderUpi: userData.upi || "",
        respondedAt: new Date()
      });
  
      alert("Response sent!");
    } catch (err) {
      console.error("Error responding to request:", err);
      alert("Could not send response.");
    }
  }
  
  // Fetch and render items for sale
  async function fetchItemsForSale() {
    try {
      const snapshot = await getDocs(collection(db, 'items'));
      if (snapshot.empty) {
        itemsContainer.innerHTML = "<p>No items available for sale.</p>";
        return;
      }
  
      allItems = [];
      snapshot.forEach(doc => {
        const item = doc.data();
        item.id = doc.id;
        allItems.push(item);
      });
  
      renderItems(allItems);
    } catch (err) {
      console.error("Error fetching items:", err);
      itemsContainer.innerHTML = "<p>Could not load items.</p>";
    }
  }
  
  function renderItems(items) {
    itemsContainer.innerHTML = "";
    if (items.length === 0) {
      itemsContainer.innerHTML = "<p>No items match your search.</p>";
      return;
    }
  
    items.forEach(item => {
      const itemCard = document.createElement("div");
      itemCard.className = "item-card";
      itemCard.innerHTML = `
        <h4>${item.itemName || "Unnamed Item"}</h4>
        <p><strong>Price:</strong> ₹${item.itemPrice || "Not specified"}</p>
        <p><strong>Description:</strong> ${item.itemDescription || "No description"}</p>
      `;
  
      if (item.userID) {
        itemCard.style.cursor = "pointer";
        itemCard.addEventListener("click", () => {
          window.location.href = `profile.html?userId=${item.userID}`;
        });
      }
  
      itemsContainer.appendChild(itemCard);
    });
  }
  
  // Fetch and render requested items
  async function fetchRequestedItems(currentUser) {
    try {
      const snapshot = await getDocs(collection(db, 'requests'));
      if (snapshot.empty) {
        requestsContainer.innerHTML = "<p>No requested items found.</p>";
        return;
      }
  
      allRequests = [];
      snapshot.forEach(docSnap => {
        const req = docSnap.data();
        req.id = docSnap.id;
        allRequests.push(req);
      });
  
      renderRequests(allRequests, currentUser);
    } catch (err) {
      console.error("Error fetching requests:", err);
      requestsContainer.innerHTML = "<p>Could not load requests.</p>";
    }
  }
  
  function renderRequests(requests, currentUser) {
    requestsContainer.innerHTML = "";
  
    if (requests.length === 0) {
      requestsContainer.innerHTML = "<p>No requests match your search.</p>";
      return;
    }
  
    requests.forEach(req => {
      const reqCard = document.createElement("div");
      reqCard.className = "request-card";
      reqCard.innerHTML = `
        <h4>${req.requestedItem || "Unnamed Request"}</h4>
        <p><strong>Purpose:</strong> ${req.purpose || "N/A"}</p>
        <p><strong>Description:</strong> ${req.requestDescription || "No description"}</p>
        <p><strong>Urgency:</strong> ${req.urgencyLevel || "Not specified"}</p>
        <button class="ihaveit-btn">I have it</button>
      `;
  
      const btn = reqCard.querySelector(".ihaveit-btn");
      btn.addEventListener("click", () => {
        btn.disabled = true;
        btn.textContent = "Sending...";
        handleResponderResponse(req.id, req.requesterID || req.userID, currentUser)
          .finally(() => {
            btn.disabled = false;
            btn.textContent = "I have it";
          });
      });
  
      requestsContainer.appendChild(reqCard);
    });
  }
  
  // Search filter for items
  if (itemSearchInput) {
    itemSearchInput.addEventListener("input", () => {
      const query = itemSearchInput.value.toLowerCase();
      const filtered = allItems.filter(item =>
        item.itemName?.toLowerCase().includes(query) ||
        item.itemDescription?.toLowerCase().includes(query)
      );
      renderItems(filtered);
    });
  }
  
  // Search filter for requests
  if (requestSearchInput) {
    requestSearchInput.addEventListener("input", () => {
      const query = requestSearchInput.value.toLowerCase();
      const filtered = allRequests.filter(req =>
        req.requestedItem?.toLowerCase().includes(query) ||
        req.requestDescription?.toLowerCase().includes(query) ||
        req.purpose?.toLowerCase().includes(query)
      );
      renderRequests(filtered, auth.currentUser);
    });
  }
  
  // Init
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      fetchItemsForSale();
      fetchRequestedItems(user);
    } else {
      window.location.href = "auth.html";
    }
  });
  