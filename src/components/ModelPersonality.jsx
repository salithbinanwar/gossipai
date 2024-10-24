import { useState } from 'react'
import { FiEdit3, FiSave } from 'react-icons/fi'

export default function ModelPersonality({
  onSave,
  initialRole = '',
  initialName = '',
}) {
  const [role, setRole] = useState(initialRole)
  const [name, setName] = useState(initialName)
  const [isEditing, setIsEditing] = useState(!initialRole)

  const predefinedRoles = [
    {
      title: 'Friendly Assistant',
      description:
        'I am a helpful and friendly AI assistant, eager to help with any task.',
    },
    {
      title: 'Professional Expert',
      description:
        'I am a knowledgeable professional, providing detailed and accurate information.',
    },
    {
      title: 'Creative Writer',
      description:
        'I am a creative writer, skilled in storytelling and artistic expression.',
    },
    {
      title: 'Code Mentor',
      description:
        'I am a coding mentor, helping you learn and understand programming concepts.',
    },
    {
      title: 'Custom Role',
      description: 'Define a custom role and personality...',
    },
  ]

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name, role })
    setIsEditing(false)
  }

  const handleRoleSelect = (predefinedRole) => {
    if (predefinedRole.title === 'Custom Role') {
      setIsEditing(true)
      return
    }
    setRole(predefinedRole.description)
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400">
              AI Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give your AI a name..."
              className="w-full p-2 rounded-lg bg-gray-800/50 border border-cyan-500/30
              focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
              transition-all duration-300 placeholder-gray-500 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400">
              Role & Personality
            </label>
            <textarea
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Describe the AI's role and personality..."
              className="w-full p-2 rounded-lg bg-gray-800/50 border border-cyan-500/30
              focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
              transition-all duration-300 placeholder-gray-500 text-sm h-24 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
              bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
              text-white font-medium transition-all duration-200 disabled:opacity-50
              disabled:cursor-not-allowed text-sm"
            >
              <FiSave className="w-4 h-4" />
              Save Personality
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800/30 rounded-lg p-3 border border-cyan-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-cyan-400">{name}</h3>
                <p className="text-sm text-gray-400 mt-1">{role}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20
                text-cyan-400 transition-all duration-200"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-400">Predefined Roles:</p>
          <div className="grid grid-cols-1 gap-2">
            {predefinedRoles.map((predefinedRole) => (
              <button
                key={predefinedRole.title}
                onClick={() => handleRoleSelect(predefinedRole)}
                className={`p-2 rounded-lg text-left transition-all duration-200 border
                ${
                  role === predefinedRole.description
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-gray-800/30 border-gray-700 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400'
                }`}
              >
                <div className="text-sm font-medium">
                  {predefinedRole.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {predefinedRole.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
