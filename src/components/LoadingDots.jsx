export default function LoadingDots() {
  return (
    <div className="flex space-x-2 items-center">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  )
}
