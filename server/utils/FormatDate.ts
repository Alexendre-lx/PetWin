export function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp * 1000); 
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

  if (diffInSeconds < 60) {
    return `Il y a ${diffInSeconds} sec`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} min${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
}

export function formatDateRange(startTimestamp: number, endTimestamp: number): string {
  const startDate = new Date(startTimestamp * 1000);
  const endDate = new Date(endTimestamp * 1000);

  const monthNames: string[] = [
    'JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUI', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  const startMonth = monthNames[startDate.getMonth()];
  const endMonth = monthNames[endDate.getMonth()];

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  return `DU ${startDay} ${startMonth}  AU ${endDay} ${endMonth} `;
}

export function formatDateContest(startTimestamp: number, endTimestamp: number): { formattedDate: string; daysLeft: string }  {
  const startDate = new Date(startTimestamp * 1000);
  const endDate = new Date(endTimestamp * 1000);

  const monthNames: string[] = [
    'JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUI', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  const startMonth = monthNames[startDate.getMonth()];
  const endMonth = monthNames[endDate.getMonth()];

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const endHour = endDate.getHours();

  const endMinutes = endDate.getMinutes();
  const formattedDate = `DU ${startDay} ${startMonth} AU ${endDay} ${endMonth} à ${endHour}:${endMinutes < 10 ? '0' : ''}${endMinutes} `;

  const currentDate = new Date();
  const daysRemaining = Math.floor((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysLeft = `${daysRemaining} jours restants`;
  
  return {
    formattedDate, 
    daysLeft
  }
}

