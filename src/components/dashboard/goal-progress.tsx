interface GoalProgressProps {
  current: number
  goal: number
  progress: number
}

export function GoalProgress({ current, goal, progress }: GoalProgressProps) {
  const milestones = [50, 100, 150, 200]
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="bg-navy-light border border-navy-lighter rounded-xl p-6 h-full">
      <h3 className="font-display font-semibold text-white mb-6">Daily Goal</h3>

      {/* Progress ring */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
            <circle
              cx="90" cy="90" r={radius}
              fill="none"
              stroke="#242A45"
              strokeWidth="12"
            />
            <circle
              cx="90" cy="90" r={radius}
              fill="none"
              stroke={progress >= 100 ? '#00C896' : '#FF5C35'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-white">
              {Math.round(progress)}%
            </span>
            <span className="text-xs text-gray-400 mt-0.5">of ${goal}/day</span>
          </div>
        </div>
      </div>

      {/* Current profit */}
      <div className="text-center mb-6">
        <p className="font-display text-3xl font-bold" style={{ color: current >= 0 ? '#00C896' : '#FF5C35' }}>
          ${current.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 mt-1">profit today</p>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        {milestones.map((m) => (
          <div key={m} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors"
              style={{
                borderColor: current >= m ? '#00C896' : '#2E3555',
                backgroundColor: current >= m ? '#00C896' : 'transparent',
              }}
            />
            <div className="flex-1 bg-navy-lighter rounded-full h-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (current / m) * 100)}%`,
                  backgroundColor: current >= m ? '#00C896' : '#FF5C35',
                }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10 text-right">${m}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
