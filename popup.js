class BookmarkAllWindows {
  constructor() {
    this.windowCountEl = document.getElementById('windowCount');
    this.tabCountEl = document.getElementById('tabCount');
    this.bookmarkBtn = document.getElementById('bookmarkBtn');
    this.folderPrefixInput = document.getElementById('folderPrefix');
    this.statusEl = document.getElementById('status');
    this.progressContainer = document.getElementById('progress');
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
    this.resultEl = document.getElementById('result');
    
    this.init();
  }

  async init() {
    await this.updateStats();
    this.bookmarkBtn.addEventListener('click', () => this.bookmarkAllWindows());
  }

  async updateStats() {
    const windows = await chrome.windows.getAll({ populate: true });
    const normalWindows = windows.filter(w => w.type === 'normal');
    const totalTabs = normalWindows.reduce((sum, w) => sum + w.tabs.length, 0);
    
    this.windowCountEl.textContent = normalWindows.length;
    this.tabCountEl.textContent = totalTabs;
  }

  showStatus(message, type = 'info') {
    this.statusEl.textContent = message;
    this.statusEl.className = `status ${type}`;
    this.statusEl.classList.remove('hidden');
  }

  hideStatus() {
    this.statusEl.classList.add('hidden');
  }

  updateProgress(percent) {
    this.progressFill.style.width = `${percent}%`;
    this.progressText.textContent = `${Math.round(percent)}%`;
  }

  showProgress() {
    this.progressContainer.classList.remove('hidden');
    this.updateProgress(0);
  }

  hideProgress() {
    this.progressContainer.classList.add('hidden');
  }

  formatTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}`;
  }

  async findOtherBookmarksFolder() {
    const tree = await chrome.bookmarks.getTree();
    const rootChildren = tree[0].children;
    
    for (const node of rootChildren) {
      if (node.title === 'Other Bookmarks' || node.title === 'Other bookmarks' || node.id === '2') {
        return node;
      }
    }
    
    return rootChildren.find(n => n.id === '2') || rootChildren[1];
  }

  async bookmarkAllWindows() {
    this.bookmarkBtn.disabled = true;
    this.resultEl.classList.add('hidden');
    this.hideStatus();
    this.showProgress();

    try {
      const windows = await chrome.windows.getAll({ populate: true });
      const normalWindows = windows.filter(w => w.type === 'normal');

      if (normalWindows.length === 0) {
        this.showStatus('No windows found to bookmark.', 'error');
        this.hideProgress();
        this.bookmarkBtn.disabled = false;
        return;
      }

      const otherBookmarks = await this.findOtherBookmarksFolder();
      const prefix = this.folderPrefixInput.value.trim() || 'Session';
      const timestamp = this.formatTimestamp();
      
      const results = [];
      const totalWindows = normalWindows.length;

      for (let i = 0; i < normalWindows.length; i++) {
        const window = normalWindows[i];
        const windowNumber = i + 1;
        const folderName = `${prefix}_${timestamp}_Window-${windowNumber}`;

        const folder = await chrome.bookmarks.create({
          parentId: otherBookmarks.id,
          title: folderName
        });

        const validTabs = window.tabs.filter(tab => 
          tab.url && 
          !tab.url.startsWith('chrome://') && 
          !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('brave://') &&
          !tab.url.startsWith('about:')
        );

        for (const tab of validTabs) {
          await chrome.bookmarks.create({
            parentId: folder.id,
            title: tab.title || tab.url,
            url: tab.url
          });
        }

        results.push({
          folderName,
          tabCount: validTabs.length
        });

        this.updateProgress(((i + 1) / totalWindows) * 100);
      }

      this.hideProgress();
      this.showResults(results);
      this.showStatus('All windows bookmarked successfully!', 'success');

    } catch (error) {
      this.hideProgress();
      this.showStatus(`Error: ${error.message}`, 'error');
      console.error('Bookmark error:', error);
    }

    this.bookmarkBtn.disabled = false;
  }

  showResults(results) {
    const totalTabs = results.reduce((sum, r) => sum + r.tabCount, 0);
    
    this.resultEl.innerHTML = `
      <h3>✅ Created ${results.length} folders with ${totalTabs} bookmarks</h3>
      <ul class="result-list">
        ${results.map(r => `
          <li>
            <span class="folder-icon">📁</span>
            <span class="folder-name">${r.folderName}</span>
            <span class="tab-count">${r.tabCount} tabs</span>
          </li>
        `).join('')}
      </ul>
    `;
    this.resultEl.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BookmarkAllWindows();
});

