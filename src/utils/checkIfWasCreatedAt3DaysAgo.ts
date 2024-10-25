export function checkIfWasCreatedAt3DaysAgo(createdAt: string) {
  const inputDate = new Date(createdAt)
  const currentDate = new Date()

  // Check if date is invalid
  if (isNaN(inputDate.getTime())) {
    throw new Error('Invalid date format')
  }

  // Calculate the difference in milliseconds
  const timeDifference = currentDate.getTime() - inputDate.getTime()

  // Convert milliseconds to days
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24)

  return daysDifference >= 3
}
