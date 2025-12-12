import './styles/reset.css';
import './styles/main.css';
import { Editor } from './scripts/Editor';
import { EditorObject } from './scripts/EditorObject';

const editor = new Editor();
editor.add(new EditorObject(0, 0, '#312e81'));
editor.add(new EditorObject(10, 0, '#4338ca'));
editor.add(new EditorObject(20, 0, '#6366f1'));
editor.add(new EditorObject(0, 10, '#4c1d95'));
editor.add(new EditorObject(10, 10, '#6d28d9'));
editor.add(new EditorObject(20, 10, '#8b5cf6'));
editor.add(new EditorObject(0, 20, '#581c87'));
editor.add(new EditorObject(10, 20, '#7e22ce'));
editor.add(new EditorObject(20, 20, '#a855f7'));