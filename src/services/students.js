export const fetchStudents = async () => {
  const response = await fetch('https://6a178e231878294b597b9447.mockapi.io/api/v1/students')

  return await response.json()
}

export const createStudent = async (payload) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }

  const response = await fetch('https://6a178e231878294b597b9447.mockapi.io/api/v1/students', options)

  return await response.json()
}

export const getStudentById = async (id) => {
  const response = await fetch(`https://6a178e231878294b597b9447.mockapi.io/api/v1/students/${id}`)

  return await response.json()
}

export const updateStudent = async (payload) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: payload.name,
      city: payload.city
    })
  }

  const response = await fetch(`https://6a178e231878294b597b9447.mockapi.io/api/v1/students/${payload.id}`, options)

  return await response.json()
}

export const removeStudent = async (id) => {
  const options = {
    method: 'DELETE'
  }

  const response = await fetch(`https://6a178e231878294b597b9447.mockapi.io/api/v1/students/${id}`, options)

  return await response.json()
}