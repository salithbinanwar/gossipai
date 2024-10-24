import { useState } from 'react'
import { FiInfo } from 'react-icons/fi'

export default function NetworkInfo({ onIPSelect }) {
  const [copied, setCopied] = useState(false)

  const copyAndSelect = (ip) => {
    navigator.clipboard.writeText(`http://${ip}:3000`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      if (onIPSelect) {
        onIPSelect(ip)
      }
    })
  }

  const commonIPs = ['192.168.1.101', '192.168.0.101', '10.0.0.101']

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <FiInfo className="w-4 h-4" />
          <span className="text-sm font-medium">Find Your IP Address</span>
        </div>

        <div className="space-y-3">
          <div className="bg-black/20 rounded-lg p-2.5 border border-white/5">
            <p className="text-sm font-mono text-gray-400 leading-relaxed">
              <span className="text-cyan-400">1.</span> Open terminal/command
              prompt
              <br />
              <span className="text-cyan-400">2.</span> Type:
              <span className="mx-1 px-1.5 py-0.5 rounded bg-gray-800/50 text-cyan-400">
                ipconfig
              </span>
              <span className="text-gray-500">(Windows)</span> or
              <span className="mx-1 px-1.5 py-0.5 rounded bg-gray-800/50 text-cyan-400">
                ifconfig
              </span>
              <span className="text-gray-500">(Mac/Linux)</span>
              <br />
              <span className="text-cyan-400">3.</span> Look for "IPv4 Address"
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400">
              Common local IPs (tap to use):
            </p>
            <div className="flex flex-wrap gap-2">
              {commonIPs.map((ip) => (
                <button
                  key={ip}
                  onClick={() => copyAndSelect(ip)}
                  className="px-3 py-1.5 rounded-full text-sm bg-cyan-500/10
                  hover:bg-cyan-500/20 text-cyan-400 transition-all duration-200
                  border border-cyan-500/20 hover:border-cyan-500/30"
                >
                  {ip}
                </button>
              ))}
            </div>
          </div>

          {copied && (
            <div className="text-xs text-green-400 animate-fade-in">
              ✓ IP copied and selected
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
