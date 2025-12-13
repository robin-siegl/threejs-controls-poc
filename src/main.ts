import './styles/reset.css';
import './styles/main.css';
import { Editor } from './scripts/Editor';
import { EditorObject } from './scripts/EditorObject';

const editor = new Editor();
editor.add(new EditorObject(0, 0, '#2563eb'));
editor.add(new EditorObject(10, 0, '#60a5fa'));
editor.add(new EditorObject(20, 0, '#bfdbfe'));
editor.add(new EditorObject(0, 10, '#4f46e5'));
editor.add(new EditorObject(10, 10, '#818cf8'));
editor.add(new EditorObject(20, 10, '#c7d2fe'));
editor.add(new EditorObject(0, 20, '#7c3aed'));
editor.add(new EditorObject(10, 20, '#a78bfa'));
editor.add(new EditorObject(20, 20, '#ddd6fe'));