import { editorialNotes } from '../data/editorial-notes';
import EditorialObject from './EditorialObject';
export default function EditorialNote({ id, className }: { id: string; className?: string }) {
  const note = editorialNotes.find((item) => item.id === id)!;
  return (
    <>
      <p className={className}>{note.text}</p>
      <EditorialObject object={note} label="Hinweis" />
    </>
  );
}
