const addBookmarkForm = document.getElementById('add-bookmark-form');
const bookmarksListContainer = document.getElementById('bookmarks-list');
const filterCategorySelect = document.getElementById('filter-category');
const searchTermInput = document.getElementById('search-term');
const noBookmarksMessage = document.getElementById('no-bookmarks');
const localStorageKey = 'bookmarks';

let bookmarks = loadBookmarksFromStorage();
renderBookmarks(bookmarks); // Initial render

// 4. Persist with localStorage (Load)
function loadBookmarksFromStorage() {
    const storedBookmarks = localStorage.getItem(localStorageKey);
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
}

// 4. Persist with localStorage (Save)
function saveBookmarksToStorage() {
    localStorage.setItem(localStorageKey, JSON.stringify(bookmarks));
}

// 1. Add & Display Bookmarks: Render
function renderBookmarks(bookmarkArray) {
    bookmarksListContainer.innerHTML = '';
    if (bookmarkArray.length === 0) {
        noBookmarksMessage.style.display = 'block';
        return;
    }
    noBookmarksMessage.style.display = 'none';

    bookmarkArray.map((bookmark, index) => {
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.classList.add('bookmark-item');
        bookmarkDiv.innerHTML = `
            <div>
                <h3>${bookmark.title}</h3>
                <p><a href="${bookmark.url}" target="_blank">${bookmark.url}</a></p>
                <p>Category: ${bookmark.category}</p>
            </div>
            <div class="bookmark-actions">
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        bookmarksListContainer.appendChild(bookmarkDiv);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteBookmark);
    });
}

// 1. Add & Display Bookmarks: Validate URL
function isValidURL(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}

// 2. Bookmark Management: Add Bookmark
addBookmarkForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const urlInput = document.getElementById('url');
    const categorySelect = document.getElementById('category');

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const category = categorySelect.value;

    if (!title || !url) {
        alert('Title and URL are required.');
        return;
    }

    if (!isValidURL(url)) {
        alert('Please enter a valid URL starting with http:// or https://');
        return;
    }

    const newBookmark = { title, url, category };
    bookmarks.push(newBookmark);
    saveBookmarksToStorage();
    renderBookmarks(bookmarks);

    addBookmarkForm.reset();
});

// 2. Bookmark Management: Delete Bookmark
function deleteBookmark(event) {
    const indexToDelete = parseInt(event.target.dataset.index);
    if (!isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < bookmarks.length) {
        bookmarks = bookmarks.filter((_, index) => index !== indexToDelete);
        saveBookmarksToStorage();
        renderBookmarks(bookmarks);
    }
}

// 3. Filter & Search: Filter by Category
filterCategorySelect.addEventListener('change', function() {
    const selectedCategory = this.value;
    const filteredBookmarks = selectedCategory
        ? bookmarks.filter(bookmark => bookmark.category === selectedCategory)
        : bookmarks;
    const searchTerm = searchTermInput.value.toLowerCase();
    const finalFilteredBookmarks = filterBookmarksBySearch(filteredBookmarks, searchTerm);
    renderBookmarks(finalFilteredBookmarks);
});

// 3. Filter & Search: Search Bar
searchTermInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const selectedCategory = filterCategorySelect.value;
    const categoryFilteredBookmarks = selectedCategory
        ? bookmarks.filter(bookmark => bookmark.category === selectedCategory)
        : bookmarks;
    const finalFilteredBookmarks = filterBookmarksBySearch(categoryFilteredBookmarks, searchTerm);
    renderBookmarks(finalFilteredBookmarks);
});

function filterBookmarksBySearch(bookmarkArray, searchTerm) {
    return bookmarkArray.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.url.toLowerCase().includes(searchTerm)
    );
}

// On page load (already called after loading from storage)