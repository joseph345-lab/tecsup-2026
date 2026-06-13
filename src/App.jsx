import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'

const STORAGE_KEY = 'tecsup-proyecto-final-students'

const seedStudents = [
  { id: 'stu-1', name: 'Andrea Torres', career: 'Diseño Web', city: 'Lima', email: 'andrea.torres@tecsup.edu.pe' },
  { id: 'stu-2', name: 'Luis Paredes', career: 'Desarrollo de Software', city: 'Arequipa', email: 'luis.paredes@tecsup.edu.pe' },
  { id: 'stu-3', name: 'Carla Mendoza', career: 'Redes y Comunicaciones', city: 'Trujillo', email: 'carla.mendoza@tecsup.edu.pe' },
  { id: 'stu-4', name: 'Diego Rojas', career: 'Diseño Web', city: 'Chiclayo', email: 'diego.rojas@tecsup.edu.pe' },
]

const emptyForm = {
  name: '',
  career: '',
  city: '',
  email: '',
}

const createStudentId = () => {
  if (globalThis.crypto?.randomUUID) {
    return `stu-${globalThis.crypto.randomUUID()}`
  }

  return `stu-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeStudent = (student) => ({
  ...student,
  name: student.name.trim(),
  career: student.career.trim(),
  city: student.city.trim(),
  email: student.email.trim(),
})

const readStudents = () => {
  const raw = globalThis.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return seedStudents
  }

  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return seedStudents
  }

  return parsed.map(normalizeStudent)
}

const StatCard = ({ label, value, hint }) => (
  <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    <p className="mt-1 text-sm text-slate-500">{hint}</p>
  </article>
)

const Shell = ({ students, onResetData }) => {
  const uniqueCities = new Set(students.map((student) => student.city)).size
  const uniqueCareers = new Set(students.map((student) => student.career)).size

  const navClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-semibold transition',
      isActive ? 'bg-black text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200',
    ].join(' ')

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-600">Proyecto final frontend</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Gestor Académico TECSUP</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                CRUD con rutas, persistencia local y una interfaz clara para administrar estudiantes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <NavLink to="/" className={navClass} end>Inicio</NavLink>
              <NavLink to="/estudiantes" className={navClass}>Estudiantes</NavLink>
              <NavLink to="/estudiantes/nuevo" className={navClass}>Nuevo</NavLink>
              <button
                type="button"
                onClick={onResetData}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
              >
                Restaurar datos
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <StatCard label="Estudiantes" value={students.length} hint="Registros guardados en el navegador" />
            <StatCard label="Ciudades" value={uniqueCities} hint="Cobertura geográfica de la lista" />
            <StatCard label="Carreras" value={uniqueCareers} hint="Especialidades representadas" />
          </div>
        </header>

        <Outlet />

      </div>
    </div>
  )
}

const HomePage = ({ students }) => (
  <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-lg">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">React + Router + CRUD</p>
        <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
          Un proyecto final simple, ordenado y listo para entregar.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          Este proyecto cumple con listado, creación, edición, eliminación, persistencia en localStorage,
          rutas y confirmación antes de borrar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/estudiantes" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
            Ver estudiantes
          </Link>
          <Link to="/estudiantes/nuevo" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Agregar estudiante
          </Link>
        </div>
      </div>
    </article>

    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">Vista rápida</p>
      <ul className="mt-5 space-y-4 text-sm text-slate-600">
        <li className="rounded-2xl bg-slate-50 p-4">Listado con búsqueda y accesos rápidos.</li>
        <li className="rounded-2xl bg-slate-50 p-4">Formulario para crear y editar registros.</li>
        <li className="rounded-2xl bg-slate-50 p-4">Detalle del estudiante y eliminación confirmada.</li>
      </ul>
      <p className="mt-6 text-sm text-slate-500">Registros actuales: <span className="font-bold text-slate-900">{students.length}</span></p>
    </aside>
  </section>
)

const StudentsPage = ({ students, onDeleteStudent }) => {
  const [query, setQuery] = useState('')

  const filteredStudents = students.filter((student) => {
    const value = query.toLowerCase().trim()

    if (!value) {
      return true
    }

    return [student.name, student.career, student.city, student.email].some((field) =>
      field.toLowerCase().includes(value)
    )
  })

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Listado</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Estudiantes registrados</h2>
        </div>

        <label className="w-full max-w-md">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Buscar</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre, carrera, ciudad o correo"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4">
        {filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No hay coincidencias para esa búsqueda.
          </div>
        ) : (
          filteredStudents.map((student) => (
            <article key={student.id} className="rounded-2xl border border-slate-200 p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{student.name}</p>
                  <p className="text-sm text-slate-500">{student.career}</p>
                </div>

                <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:flex lg:items-center lg:gap-6">
                  <span>{student.city}</span>
                  <span>{student.email}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/estudiantes/${student.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                    Ver
                  </Link>
                  <Link to={`/estudiantes/${student.id}/editar`} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: '¿Eliminar estudiante?',
                        text: 'Esta acción no se puede deshacer.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#0f172a',
                      })

                      if (result.isConfirmed) {
                        await onDeleteStudent(student.id)
                      }
                    }}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

const StudentFormPage = ({ students, onCreateStudent, onUpdateStudent }) => {
  const navigate = useNavigate()
  const params = useParams()
  const student = students.find((item) => item.id === params.id)
  const isEditMode = Boolean(student && params.id)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (isEditMode && student) {
      setForm({
        name: student.name,
        career: student.career,
        city: student.city,
        email: student.email,
      })
      return
    }

    setForm(emptyForm)
  }, [isEditMode, student])

  if (params.id && !student) {
    return <Navigate to="/estudiantes" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isEditMode && student) {
      await onUpdateStudent(student.id, form)
      navigate(`/estudiantes/${student.id}`)
      return
    }

    const createdStudent = await onCreateStudent(form)
    navigate(`/estudiantes/${createdStudent.id}`)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Formulario</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">{isEditMode ? 'Editar estudiante' : 'Nuevo estudiante'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Nombre completo</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej. Victor Villazón"
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Carrera</span>
          <input
            required
            name="career"
            value={form.career}
            onChange={handleChange}
            placeholder="Ej. Desarrollo de Software"
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Ciudad</span>
          <input
            required
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Ej. Lima"
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Correo</span>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ej. alumno@tecsup.edu.pe"
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          />
        </label>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/estudiantes')}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}

const StudentDetailPage = ({ students, onDeleteStudent }) => {
  const navigate = useNavigate()
  const params = useParams()
  const student = students.find((item) => item.id === params.id)

  if (!student) {
    return <Navigate to="/estudiantes" replace />
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar estudiante?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0f172a',
    })

    if (result.isConfirmed) {
      await onDeleteStudent(student.id)
      navigate('/estudiantes')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Detalle</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">{student.name}</h2>
          <p className="mt-1 text-slate-500">{student.career}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={`/estudiantes/${student.id}/editar`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
            Editar
          </Link>
          <button type="button" onClick={handleDelete} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
            Eliminar
          </button>
          <Link to="/estudiantes" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Volver
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Ciudad</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{student.city}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Correo</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{student.email}</p>
        </div>
      </div>
    </section>
  )
}

const NotFoundPage = () => (
  <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
    <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">404</p>
    <h2 className="mt-3 text-3xl font-black text-slate-900">Página no encontrada</h2>
    <p className="mt-3 text-slate-600">La ruta solicitada no existe dentro del proyecto final.</p>
    <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
      Volver al inicio
    </Link>
  </section>
)

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-500">Cargando proyecto final...</p>
    </div>
  </div>
)

const ErrorScreen = ({ message, onRetry }) => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-lg rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-600">Error</p>
      <h2 className="mt-3 text-2xl font-black text-slate-900">No se pudieron cargar los datos</h2>
      <p className="mt-3 text-sm text-slate-600">{message}</p>
      <button type="button" onClick={onRetry} className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
        Restaurar información
      </button>
    </div>
  </div>
)

const App = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setStudents(readStudents())
        setError('')
      } catch {
        setError('La información guardada está dañada. Puedes restaurar los datos de ejemplo.')
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (loading || error) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  }, [students, loading, error])

  const handleCreateStudent = async (payload) => {
    const student = {
      id: createStudentId(),
      ...normalizeStudent(payload),
    }

    setStudents((current) => [student, ...current])
    return student
  }

  const handleUpdateStudent = async (id, payload) => {
    setStudents((current) =>
      current.map((student) => (student.id === id ? { ...student, ...normalizeStudent(payload) } : student))
    )
  }

  const handleDeleteStudent = async (id) => {
    setStudents((current) => current.filter((student) => student.id !== id))
  }

  const handleResetData = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    setError('')
    setStudents(seedStudents)
    setLoading(false)
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={handleResetData} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell students={students} onResetData={handleResetData} />}>
          <Route index element={<HomePage students={students} />} />
          <Route path="estudiantes" element={<StudentsPage students={students} onDeleteStudent={handleDeleteStudent} />} />
          <Route path="estudiantes/nuevo" element={<StudentFormPage students={students} onCreateStudent={handleCreateStudent} onUpdateStudent={handleUpdateStudent} />} />
          <Route path="estudiantes/:id" element={<StudentDetailPage students={students} onDeleteStudent={handleDeleteStudent} />} />
          <Route path="estudiantes/:id/editar" element={<StudentFormPage students={students} onCreateStudent={handleCreateStudent} onUpdateStudent={handleUpdateStudent} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/inicio" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
