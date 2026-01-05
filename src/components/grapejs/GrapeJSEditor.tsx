// "use client";

// import { useEffect, useRef, useState } from 'react';
// import grapesjs, { Editor } from 'grapesjs';
// import 'grapesjs/dist/css/grapes.min.css';
// import gjsPresetWebpage from 'grapesjs-preset-webpage';
// import gjsBlocksBasic from 'grapesjs-blocks-basic';

// interface GrapeJSEditorProps {
//     pageData?: {
//         html?: string;
//         css?: string;
//         components?: any;
//         styles?: any;
//     };
//     onSave?: (data: {
//         html: string;
//         css: string;
//         components: any;
//         styles: any;
//     }) => void;
// }

// export default function GrapeJSEditor({ pageData, onSave }: GrapeJSEditorProps) {
//     const editorRef = useRef<Editor | null>(null);
//     const [isLoaded, setIsLoaded] = useState(false);

//     useEffect(() => {
//         if (!editorRef.current) {
//             const editor = grapesjs.init({
//                 container: '#gjs-editor',
//                 height: '100vh',
//                 width: 'auto',
//                 storageManager: false, // We'll handle storage via API
//                 plugins: [gjsPresetWebpage, gjsBlocksBasic],
//                 pluginsOpts: {
//                     'grapesjs-preset-webpage': {
//                         blocksBasicOpts: {
//                             blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
//                             flexGrid: 1,
//                         },
//                         blocks: ['link-block', 'quote', 'text-basic'],
//                     },
//                 },
//                 canvas: {
//                     styles: [
//                         'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
//                     ],
//                 },
//                 blockManager: {
//                     appendTo: '#blocks',
//                 },
//                 styleManager: {
//                     appendTo: '#styles-container',
//                     sectors: [
//                         {
//                             name: 'General',
//                             properties: [
//                                 {
//                                     extend: 'float',
//                                     type: 'radio',
//                                     default: 'none',
//                                     options: [
//                                         { value: 'none', className: 'fa fa-times' },
//                                         { value: 'left', className: 'fa fa-align-left' },
//                                         { value: 'right', className: 'fa fa-align-right' },
//                                     ],
//                                 },
//                                 'display',
//                                 { extend: 'position', type: 'select' },
//                                 'top',
//                                 'right',
//                                 'left',
//                                 'bottom',
//                             ],
//                         },
//                         {
//                             name: 'Dimension',
//                             open: false,
//                             properties: [
//                                 'width',
//                                 {
//                                     id: 'flex-width',
//                                     type: 'integer',
//                                     name: 'Width',
//                                     units: ['px', '%'],
//                                     property: 'flex-basis',
//                                     toRequire: 1,
//                                 },
//                                 'height',
//                                 'max-width',
//                                 'min-height',
//                                 'margin',
//                                 'padding',
//                             ],
//                         },
//                         {
//                             name: 'Typography',
//                             open: false,
//                             properties: [
//                                 'font-family',
//                                 'font-size',
//                                 'font-weight',
//                                 'letter-spacing',
//                                 'color',
//                                 'line-height',
//                                 {
//                                     extend: 'text-align',
//                                     options: [
//                                         { id: 'left', label: 'Left', className: 'fa fa-align-left' },
//                                         { id: 'center', label: 'Center', className: 'fa fa-align-center' },
//                                         { id: 'right', label: 'Right', className: 'fa fa-align-right' },
//                                         { id: 'justify', label: 'Justify', className: 'fa fa-align-justify' },
//                                     ],
//                                 },
//                                 {
//                                     property: 'text-decoration',
//                                     type: 'radio',
//                                     default: 'none',
//                                     options: [
//                                         { id: 'none', label: 'None', className: 'fa fa-times' },
//                                         { id: 'underline', label: 'underline', className: 'fa fa-underline' },
//                                         { id: 'line-through', label: 'Line-through', className: 'fa fa-strikethrough' },
//                                     ],
//                                 },
//                                 'text-shadow',
//                             ],
//                         },
//                         {
//                             name: 'Decorations',
//                             open: false,
//                             properties: [
//                                 'opacity',
//                                 'border-radius',
//                                 'border',
//                                 'box-shadow',
//                                 'background',
//                             ],
//                         },
//                         {
//                             name: 'Extra',
//                             open: false,
//                             buildProps: ['transition', 'perspective', 'transform'],
//                         },
//                     ],
//                 },
//                 layerManager: {
//                     appendTo: '#layers-container',
//                 },
//                 traitManager: {
//                     appendTo: '#trait-container',
//                 },
//                 selectorManager: {
//                     appendTo: '#styles-container',
//                 },
//                 panels: {
//                     defaults: [
//                         {
//                             id: 'basic-actions',
//                             el: '.panel__basic-actions',
//                             buttons: [
//                                 {
//                                     id: 'visibility',
//                                     active: true,
//                                     className: 'btn-toggle-borders',
//                                     label: '<i class="fa fa-clone"></i>',
//                                     command: 'sw-visibility',
//                                 },
//                             ],
//                         },
//                         {
//                             id: 'panel-devices',
//                             el: '.panel__devices',
//                             buttons: [
//                                 {
//                                     id: 'device-desktop',
//                                     label: '<i class="fa fa-desktop"></i>',
//                                     command: 'set-device-desktop',
//                                     active: true,
//                                     togglable: false,
//                                 },
//                                 {
//                                     id: 'device-tablet',
//                                     label: '<i class="fa fa-tablet"></i>',
//                                     command: 'set-device-tablet',
//                                     togglable: false,
//                                 },
//                                 {
//                                     id: 'device-mobile',
//                                     label: '<i class="fa fa-mobile"></i>',
//                                     command: 'set-device-mobile',
//                                     togglable: false,
//                                 },
//                             ],
//                         },
//                         {
//                             id: 'panel-switcher',
//                             el: '.panel__switcher',
//                             buttons: [
//                                 {
//                                     id: 'show-layers',
//                                     active: true,
//                                     label: 'Layers',
//                                     command: 'show-layers',
//                                     togglable: false,
//                                 },
//                                 {
//                                     id: 'show-style',
//                                     active: true,
//                                     label: 'Styles',
//                                     command: 'show-styles',
//                                     togglable: false,
//                                 },
//                                 {
//                                     id: 'show-traits',
//                                     active: true,
//                                     label: 'Traits',
//                                     command: 'show-traits',
//                                     togglable: false,
//                                 },
//                             ],
//                         },
//                     ],
//                 },
//                 deviceManager: {
//                     devices: [
//                         {
//                             name: 'Desktop',
//                             width: '',
//                         },
//                         {
//                             name: 'Tablet',
//                             width: '768px',
//                             widthMedia: '992px',
//                         },
//                         {
//                             name: 'Mobile',
//                             width: '320px',
//                             widthMedia: '480px',
//                         },
//                     ],
//                 },
//             });

//             // Add custom commands
//             editor.Commands.add('set-device-desktop', {
//                 run: (editor) => editor.setDevice('Desktop'),
//             });
//             editor.Commands.add('set-device-tablet', {
//                 run: (editor) => editor.setDevice('Tablet'),
//             });
//             editor.Commands.add('set-device-mobile', {
//                 run: (editor) => editor.setDevice('Mobile'),
//             });

//             editor.Commands.add('show-layers', {
//                 run: (editor, sender) => {
//                     const lm = editor.LayerManager;
//                     const pn = editor.Panels;
//                     const id = 'layers-container';
//                     if (!sender || !sender.get || sender.get('active')) {
//                         document.getElementById(id)!.style.display = 'block';
//                     } else {
//                         document.getElementById(id)!.style.display = 'none';
//                     }
//                 },
//             });

//             editor.Commands.add('show-styles', {
//                 run: (editor, sender) => {
//                     const sm = editor.StyleManager;
//                     const pn = editor.Panels;
//                     const id = 'styles-container';
//                     if (!sender || !sender.get || sender.get('active')) {
//                         document.getElementById(id)!.style.display = 'block';
//                     } else {
//                         document.getElementById(id)!.style.display = 'none';
//                     }
//                 },
//             });

//             editor.Commands.add('show-traits', {
//                 run: (editor, sender) => {
//                     const id = 'trait-container';
//                     if (!sender || !sender.get || sender.get('active')) {
//                         document.getElementById(id)!.style.display = 'block';
//                     } else {
//                         document.getElementById(id)!.style.display = 'none';
//                     }
//                 },
//             });

//             // Load existing page data if provided
//             if (pageData) {
//                 if (pageData.components) {
//                     editor.setComponents(pageData.components);
//                 } else if (pageData.html) {
//                     editor.setComponents(pageData.html);
//                 }

//                 if (pageData.styles) {
//                     editor.setStyle(pageData.styles);
//                 } else if (pageData.css) {
//                     editor.setStyle(pageData.css);
//                 }
//             }

//             editorRef.current = editor;
//             setIsLoaded(true);
//         }

//         return () => {
//             // Cleanup on unmount
//             if (editorRef.current) {
//                 editorRef.current.destroy();
//                 editorRef.current = null;
//             }
//         };
//     }, []);

//     const handleSave = () => {
//         if (editorRef.current && onSave) {
//             const editor = editorRef.current;
//             const html = editor.getHtml();
//             const css = editor.getCss();
//             const components = editor.getComponents();
//             const styles = editor.getStyle();

//             onSave({
//                 html,
//                 css,
//                 components: components,
//                 styles: styles,
//             });
//         }
//     };

//     return (
//         <div className="grapesjs-editor-wrapper">
//             <style jsx global>{`
//         .grapesjs-editor-wrapper {
//           position: relative;
//           width: 100%;
//           height: 100vh;
//         }

//         .panel__top {
//           padding: 0;
//           width: 100%;
//           display: flex;
//           position: initial;
//           justify-content: space-between;
//           background-color: #1f2937;
//           border-bottom: 1px solid #374151;
//         }

//         .panel__basic-actions {
//           display: flex;
//           gap: 10px;
//           padding: 10px;
//         }

//         .panel__devices {
//           display: flex;
//           gap: 5px;
//           padding: 10px;
//         }

//         .panel__switcher {
//           display: flex;
//           gap: 5px;
//           padding: 10px;
//         }

//         .panel__top button {
//           background-color: #374151;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           cursor: pointer;
//           border-radius: 4px;
//           transition: background-color 0.2s;
//         }

//         .panel__top button:hover {
//           background-color: #4b5563;
//         }

//         .panel__top button.active {
//           background-color: #6366f1;
//         }

//         .save-button {
//           background-color: #10b981 !important;
//           font-weight: 600;
//         }

//         .save-button:hover {
//           background-color: #059669 !important;
//         }

//         #gjs-editor {
//           border: 3px solid #374151;
//         }

//         .gjs-one-bg {
//           background-color: #1f2937;
//         }

//         .gjs-two-color {
//           color: rgba(255, 255, 255, 0.7);
//         }

//         .gjs-three-bg {
//           background-color: #374151;
//           color: white;
//         }

//         .gjs-four-color,
//         .gjs-four-color-h:hover {
//           color: #6366f1;
//         }

//         .editor-row {
//           display: flex;
//           justify-content: flex-start;
//           align-items: stretch;
//           flex-wrap: nowrap;
//           height: calc(100vh - 60px);
//         }

//         .editor-canvas {
//           flex-grow: 1;
//           position: relative;
//         }

//         .panel__right {
//           flex-basis: 300px;
//           position: relative;
//           overflow-y: auto;
//           background-color: #1f2937;
//           border-left: 1px solid #374151;
//         }

//         .panel__left {
//           flex-basis: 250px;
//           position: relative;
//           overflow-y: auto;
//           background-color: #1f2937;
//           border-right: 1px solid #374151;
//         }

//         #blocks {
//           padding: 10px;
//         }

//         #layers-container,
//         #styles-container,
//         #trait-container {
//           padding: 10px;
//         }
//       `}</style>

//             <div className="panel__top">
//                 <div className="panel__basic-actions"></div>
//                 <div className="panel__devices"></div>
//                 <div className="panel__switcher"></div>
//                 <div style={{ padding: '10px' }}>
//                     <button className="save-button" onClick={handleSave}>
//                         <i className="fa fa-save"></i> Save Page
//                     </button>
//                 </div>
//             </div>

//             <div className="editor-row">
//                 <div className="panel__left">
//                     <div id="blocks"></div>
//                 </div>

//                 <div className="editor-canvas">
//                     <div id="gjs-editor"></div>
//                 </div>

//                 <div className="panel__right">
//                     <div id="layers-container"></div>
//                     <div id="styles-container"></div>
//                     <div id="trait-container"></div>
//                 </div>
//             </div>
//         </div>
//     );
// }
