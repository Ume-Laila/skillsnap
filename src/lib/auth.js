import { ID } from 'appwrite'
import { account } from './appwrite'

async function loginUser(email, password) {
  try {
    return await account.createEmailPasswordSession(email, password)
  } catch (error) {
    throw new Error(`Login failed: ${error?.message || 'Unable to log in.'}`)
  }
}

async function signupUser(name, email, password) {
  try {
    const user = await account.create(ID.unique(), email, password, name)
    await account.createEmailPasswordSession(email, password)
    return user
  } catch (error) {
    throw new Error(`Signup failed: ${error?.message || 'Unable to create account.'}`)
  }
}

async function logoutUser() {
  try {
    return await account.deleteSession('current')
  } catch (error) {
    throw new Error(`Logout failed: ${error?.message || 'Unable to log out.'}`)
  }
}

async function getCurrentUser() {
  try {
    return await account.get()
  } catch (error) {
    throw new Error(`Failed to fetch current user: ${error?.message || 'Unable to fetch user.'}`)
  }
}

export { loginUser, signupUser, logoutUser, getCurrentUser }
