 export function formatDateDisplay(dateString: string) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();
      if (isToday) return 'today';
      if (isYesterday) return 'yesterday';
      // Format as '12 Dec 2025'
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }