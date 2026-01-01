import axios from 'axios'

const API_BASE_URL = '/api'

export const generateGamePlay = async (game) => {
  const response = await axios.post(`${API_BASE_URL}/game/generate`, {
    game,
  })
  return response.data
}

// 房间相关API
export const createRoom = async (gameType, hostId, hostName) => {
  const response = await axios.post(`${API_BASE_URL}/rooms/create`, {
    gameType,
    hostId,
    hostName,
  })
  return response.data.room
}

export const joinRoom = async (roomCode, guestId, guestName) => {
  const response = await axios.post(`${API_BASE_URL}/rooms/join`, {
    roomCode,
    guestId,
    guestName,
  })
  return response.data.room
}

export const getRoom = async (roomCode) => {
  const response = await axios.get(`${API_BASE_URL}/rooms/${roomCode}`)
  return response.data
}

export const getWaitingRooms = async () => {
  const response = await axios.get(`${API_BASE_URL}/rooms/waiting`)
  return response.data
}

export const leaveRoom = async (roomCode, userId) => {
  const response = await axios.post(`${API_BASE_URL}/rooms/leave`, {
    roomCode,
    userId,
  })
  return response.data
}







