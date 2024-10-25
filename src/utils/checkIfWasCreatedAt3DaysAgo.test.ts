import { checkIfWasCreatedAt3DaysAgo } from './checkIfWasCreatedAt3DaysAgo'

describe('checkIfWasCreatedAt3DaysAgo', () => {
  let mockDate: Date

  beforeEach(() => {
    // Mock the current date to make tests predictable
    mockDate = new Date('2024-10-24T12:00:00.000Z')
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('should return true when date is expired', () => {
    // Date from 4 days ago
    const oldDate = new Date(mockDate)
    oldDate.setDate(oldDate.getDate() - 4)

    const result = checkIfWasCreatedAt3DaysAgo(oldDate.toISOString())
    expect(result).toBe(true)
  })

  test('should return false when date is not expired', () => {
    // Date from 2 days ago
    const recentDate = new Date(mockDate)
    recentDate.setDate(recentDate.getDate() - 2)

    const result = checkIfWasCreatedAt3DaysAgo(recentDate.toISOString())
    expect(result).toBe(false)
  })

  test('should return true when date is exactly at expiration threshold', () => {
    const thresholdDate = new Date(mockDate)
    thresholdDate.setDate(thresholdDate.getDate() - 3)

    const result = checkIfWasCreatedAt3DaysAgo(thresholdDate.toISOString())
    expect(result).toBe(true)
  })

  test('should handle future dates', () => {
    // Date 5 days in the future
    const futureDate = new Date(mockDate)
    futureDate.setDate(futureDate.getDate() + 5)

    const result = checkIfWasCreatedAt3DaysAgo(futureDate.toISOString())
    expect(result).toBe(false)
  })

  test('should handle same day with different times', () => {
    const sameDayEarlier = new Date(mockDate)
    sameDayEarlier.setHours(sameDayEarlier.getHours() - 2)

    const result = checkIfWasCreatedAt3DaysAgo(sameDayEarlier.toISOString())
    expect(result).toBe(false)
  })

  test('should throw error for invalid date format', () => {
    expect(() => checkIfWasCreatedAt3DaysAgo('invalid-date')).toThrow(
      'Invalid date format',
    )
    expect(() => checkIfWasCreatedAt3DaysAgo('2024-13-45')).toThrow(
      'Invalid date format',
    )
    expect(() => checkIfWasCreatedAt3DaysAgo('')).toThrow('Invalid date format')
    expect(() => checkIfWasCreatedAt3DaysAgo('abcd')).toThrow(
      'Invalid date format',
    )
  })
})
