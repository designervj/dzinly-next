// import page from '@/app/page'
// import React from 'react'
// import NeuralNetworkVisualizer from './NeuralNetworkVisualizer';

// function ScanStyles() {
//   return (
//     <style>{`
//       @keyframes scanMove {
//         0% { transform: translateY(-100%); opacity: 0; }
//         10% { opacity: 0.7; }
//         50% { opacity: 0.9; }
//         100% { transform: translateY(100%); opacity: 0; }
//       }
//       .scan-line {
//         animation: scanMove 3s linear infinite;
//       }
//     `}</style>
//   );
// }
// const Loadingcanvas = () => {
//   return (
//   <>
//    <div className="min-h-screen bg-white text-slate-100 flex flex-col items-center px-4 py-1.5">
//       <ScanStyles />
//       <div className="w-full">
//         {page === "neural" && (
//           <section className="grid lg:grid-cols-[2fr,1fr] gap-4 mt-2">
//             <div className="h-[360px]">
//               <NeuralNetworkVisualizer intensity={0.8} />
//             </div>
//             <div className="h-[360px] rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold mb-2">
//                   Neural Network View
//                 </h2>
//                 <p className="text-sm text-slate-400">
//                   Use this panel as your main AI visualization while an image
//                   generation job is running. Drive the <code>intensity</code>{" "}
//                   prop from backend progress to make the network feel more or
//                   less active.
//                 </p>
//               </div>
//               <div className="mt-4 text-xs text-slate-500 space-y-1">
//                 <p>
//                   • Left: animated neural network (nodes + connections +
//                   pulses).
//                 </p>
//                 <p>
//                   • Right: explanatory text / tips / CTA (e.g. "continue
//                   editing").
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {page === "code" && (
//           <section className="grid lg:grid-cols-[2fr,1fr] gap-4 mt-2">
//             <div className="h-[360px]">
//               <CodeRainWithLogs currentStepIndex={stepIndex} jobId="DZ-12345" />
//             </div>
//             <div className="h-[360px] rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold mb-2">Process Log View</h2>
//                 <p className="text-sm text-slate-400">
//                   Matrix-style code rain in the background with a foreground log
//                   of your generation pipeline steps. Map your backend events to
//                   <code>currentStepIndex</code> and the label list.
//                 </p>
//               </div>
//               <div className="mt-4 text-xs text-slate-500 space-y-1">
//                 <p>• Background: animated green code rain.</p>
//                 <p>
//                   • Foreground: live steps with active / completed indicators
//                   and a simple ETA display.
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {page === "combined" && (
//           <section className="mt-2">
//             <div className="grid lg:grid-cols-[1.4fr,1.6fr] gap-4">
//               <div className="h-[380px]">
//                 <NeuralNetworkVisualizer
//                   intensity={stepIndex / (stepsPreset.length - 1)}
//                 />
//               </div>
//               <div className="h-[380px]">
//                 <CodeRainWithLogs
//                   currentStepIndex={stepIndex}
//                   jobId="DZ-98765"
//                 />
//               </div>
//             </div>
//             <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//               <div>
//                 <h2 className="text-base font-semibold text-slate-100 mb-1">
//                   Combined Internal Generation Screen
//                 </h2>
//                 <p>
//                   Full-screen internal page: left for visual neural activity,
//                   right for the technical pipeline log. Wrap this with your
//                   existing Dzinly studio nav.
//                 </p>
//               </div>
//               <div className="text-xs text-slate-500">
//                 <p>Suggested usage:</p>
//                 <ul className="list-disc pl-4">
//                   <li>Show while FastAPI job is running</li>
//                   <li>Drive props from WebSocket progress events</li>
//                   <li>Swap to result view when job completes</li>
//                 </ul>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* {page === "analysis" && <HouseAnalysisPage />} */}
//       </div>
//     </div>
//   </>
//   )
// }

// export default Loadingcanvas