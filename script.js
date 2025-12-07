/**
 * SRM Bank Token Queue Management System
 * Implements a FIFO (First-In-First-Out) Queue for customer tokens.
 */

class Queue {
    constructor() {
        this.items = [];
    }

    // Add element to the queue
    enqueue(element) {
        this.items.push(element);
    }

    // Remove element from the queue
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }

    // View the first element
    front() {
        if (this.isEmpty()) {
            return "No elements in Queue";
        }
        return this.items[0];
    }

    // Check if empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get size
    size() {
        return this.items.length;
    }

    // Get all items
    getItems() {
        return this.items;
    }
}

// Application State
const tokenQueue = new Queue();
let lastTokenNumber = 0;
let currentServingToken = null;

// DOM Elements
const elements = {
    btnEnqueue: document.getElementById('btn-enqueue'),
    btnDequeue: document.getElementById('btn-dequeue'),
    displayTokenNumber: document.getElementById('now-serving-number'),
    displayStatus: document.getElementById('status-message'),
    waitingCount: document.getElementById('waiting-count'),
    totalIssued: document.getElementById('total-issued'),
    queueBadge: document.getElementById('queue-badge'),
    queueList: document.getElementById('queue-list'),
    nextTokenPreview: document.getElementById('next-token-preview')
};

// --- Operations ---

function generateToken() {
    lastTokenNumber++;
    return `T-${lastTokenNumber}`;
}

function handleEnqueue() {
    if (tokenQueue.size() >= 20) {
        alert("Queue is full! Maximum 20 customers allowed in waiting list.");
        return;
    }

    const newToken = generateToken();
    tokenQueue.enqueue(newToken);

    // Update Stats
    elements.totalIssued.textContent = lastTokenNumber;

    updateUI();
}

function handleDequeue() {
    if (tokenQueue.isEmpty()) {
        alert("Queue is empty! No customers to serve.");
        return;
    }

    const servedToken = tokenQueue.dequeue();
    currentServingToken = servedToken;

    // Update "Now Serving" Display
    elements.displayTokenNumber.textContent = servedToken;
    elements.displayStatus.textContent = "Please proceed to Counter 1";
    elements.displayStatus.style.color = "#10b981"; // Status Green

    updateUI();
}

function updateUI() {
    // Update Counts
    const waitingCount = tokenQueue.size();
    elements.waitingCount.textContent = waitingCount;
    elements.queueBadge.textContent = waitingCount;

    // Update Next Token Preview
    if (!tokenQueue.isEmpty()) {
        elements.nextTokenPreview.textContent = tokenQueue.front();
    } else {
        elements.nextTokenPreview.textContent = "--";
    }

    // Render Queue List
    renderQueueList();
}

function renderQueueList() {
    elements.queueList.innerHTML = ''; // Clear current list

    if (tokenQueue.isEmpty()) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>Queue is currently empty.</p>';
        elements.queueList.appendChild(emptyState);
        return;
    }

    const items = tokenQueue.getItems();

    // Append each item
    items.forEach((token, index) => {
        const li = document.createElement('li');
        li.className = 'queue-item';

        // Add staggered animation delay for cleaner look
        li.style.animationDelay = `${index * 0.05}s`;

        li.innerHTML = `
            <span class="queue-token-id">${token}</span>
            <span class="queue-status">Waiting</span>
        `;
        elements.queueList.appendChild(li);
    });
}

// --- Initialization ---

// Event Listeners
elements.btnEnqueue.addEventListener('click', handleEnqueue);
elements.btnDequeue.addEventListener('click', handleDequeue);

// Initial UI Update
updateUI();
