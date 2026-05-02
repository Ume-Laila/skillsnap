import { Client, Account, Databases, ID, Query } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID

if (!endpoint || !projectId) {
  throw new Error(
    'Appwrite configuration is missing. Please set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in .env.',
  )
}

const client = new Client().setEndpoint(endpoint).setProject(projectId)

const account = new Account(client)
const databases = new Databases(client)

async function saveRoadmap(userId, title, jobText, roadmapData) {
  if (!databaseId || !collectionId) {
    throw new Error(
      'Appwrite database configuration is missing. Please set VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_COLLECTION_ID in .env.',
    )
  }

  try {
    const payload = {
      userId,
      title,
      jobTitle: (jobText || '').slice(0, 50),
      roadmapJson: JSON.stringify(roadmapData),
      createdAt: new Date().toISOString(),
    }

    return await databases.createDocument(databaseId, collectionId, ID.unique(), payload)
  } catch (error) {
    throw new Error(`Failed to save roadmap: ${error?.message || 'Unknown error'}`)
  }
}

async function getUserRoadmaps(userId) {
  if (!databaseId || !collectionId) {
    throw new Error(
      'Appwrite database configuration is missing. Please set VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_COLLECTION_ID in .env.',
    )
  }

  try {
    return await databases.listDocuments(databaseId, collectionId, [Query.equal('userId', userId)])
  } catch (error) {
    throw new Error(`Failed to fetch user roadmaps: ${error?.message || 'Unknown error'}`)
  }
}

async function deleteRoadmap(documentId) {
  if (!databaseId || !collectionId) {
    throw new Error(
      'Appwrite database configuration is missing. Please set VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_COLLECTION_ID in .env.',
    )
  }

  try {
    return await databases.deleteDocument(databaseId, collectionId, documentId)
  } catch (error) {
    throw new Error(`Failed to delete roadmap: ${error?.message || 'Unknown error'}`)
  }
}

async function getRoadmapById(id) {
  if (!databaseId || !collectionId) {
    throw new Error(
      'Appwrite database configuration is missing. Please set VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_COLLECTION_ID in .env.',
    )
  }

  try {
    return await databases.getDocument(databaseId, collectionId, id)
  } catch (error) {
    throw new Error(`Failed to fetch roadmap by id: ${error?.message || 'Unknown error'}`)
  }
}

export { client, account, databases, saveRoadmap, getUserRoadmaps, deleteRoadmap, getRoadmapById }
