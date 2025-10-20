'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowLeft, Plus, FileText, Droplet, Thermometer, Coffee, Calendar, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  type: 'feeding' | 'baking' | 'observation' | 'general';
  title: string;
  content: string;
  temperature?: number;
  ratio?: string;
  timestamp: number;
}

const translations = {
  en: {
    title: "Baking Journal",
    subtitle: "Track your sourdough journey",
    backToDashboard: "Back to Dashboard",
    addNote: "Add Note",
    myNotes: "My Notes",
    noNotes: "No notes yet",
    noNotesDesc: "Start documenting your sourdough journey by adding your first note!",
    newNote: "New Note",
    editNote: "Edit Note",
    noteTitle: "Title",
    noteTitlePlaceholder: "e.g., Morning feeding, First bake attempt...",
    noteType: "Note Type",
    noteContent: "Notes",
    noteContentPlaceholder: "Describe what you did, what you observed, or any thoughts...",
    temperature: "Temperature (°F)",
    temperaturePlaceholder: "e.g., 75",
    ratio: "Feeding Ratio",
    ratioPlaceholder: "e.g., 1:2:2",
    save: "Save Note",
    cancel: "Cancel",
    delete: "Delete",
    types: {
      feeding: "Starter Feeding",
      baking: "Baking Session",
      observation: "Observation",
      general: "General Note"
    },
    timeAgo: {
      justNow: "Just now",
      minutesAgo: "{{minutes}}m ago",
      hoursAgo: "{{hours}}h ago",
      daysAgo: "{{days}}d ago",
      weeksAgo: "{{weeks}}w ago"
    }
  },
  ru: {
    title: "Дневник Выпечки",
    subtitle: "Отслеживайте свой путь с закваской",
    backToDashboard: "Назад к Панели",
    addNote: "Добавить Заметку",
    myNotes: "Мои Заметки",
    noNotes: "Заметок пока нет",
    noNotesDesc: "Начните документировать свой путь с закваской, добавив первую заметку!",
    newNote: "Новая Заметка",
    editNote: "Редактировать Заметку",
    noteTitle: "Заголовок",
    noteTitlePlaceholder: "напр., Утреннее кормление, Первая попытка выпечки...",
    noteType: "Тип Заметки",
    noteContent: "Заметки",
    noteContentPlaceholder: "Опишите что сделали, что наблюдали, или любые мысли...",
    temperature: "Температура (°F)",
    temperaturePlaceholder: "напр., 75",
    ratio: "Соотношение Кормления",
    ratioPlaceholder: "напр., 1:2:2",
    save: "Сохранить Заметку",
    cancel: "Отмена",
    delete: "Удалить",
    types: {
      feeding: "Кормление Закваски",
      baking: "Сессия Выпечки",
      observation: "Наблюдение",
      general: "Общая Заметка"
    },
    timeAgo: {
      justNow: "Только что",
      minutesAgo: "{{minutes}} мин назад",
      hoursAgo: "{{hours}} ч назад",
      daysAgo: "{{days}} д назад",
      weeksAgo: "{{weeks}} н назад"
    }
  }
};

export default function NotesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = React.useState(false);
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  
  // Form state
  const [noteType, setNoteType] = React.useState<Note['type']>('general');
  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [temperature, setTemperature] = React.useState('');
  const [ratio, setRatio] = React.useState('');

  // Load notes from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('sourdough:notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notes:', e);
      }
    }
  }, []);

  // Save notes to localStorage
  React.useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('sourdough:notes', JSON.stringify(notes));
    }
  }, [notes]);

  const resetForm = () => {
    setNoteType('general');
    setNoteTitle('');
    setNoteContent('');
    setTemperature('');
    setRatio('');
    setEditingNoteId(null);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const note: Note = {
      id: editingNoteId || Date.now().toString(),
      type: noteType,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      temperature: temperature ? parseFloat(temperature) : undefined,
      ratio: ratio.trim() || undefined,
      timestamp: editingNoteId 
        ? notes.find(n => n.id === editingNoteId)?.timestamp || Date.now()
        : Date.now()
    };

    if (editingNoteId) {
      setNotes(notes.map(n => n.id === editingNoteId ? note : n));
    } else {
      setNotes([note, ...notes]);
    }

    resetForm();
    setIsAddingNote(false);
  };

  const handleEditNote = (note: Note) => {
    setNoteType(note.type);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setTemperature(note.temperature?.toString() || '');
    setRatio(note.ratio || '');
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleCancel = () => {
    resetForm();
    setIsAddingNote(false);
  };

  const getTypeIcon = (type: Note['type']) => {
    switch (type) {
      case 'feeding':
        return <Droplet className="w-5 h-5" />;
      case 'baking':
        return <Coffee className="w-5 h-5" />;
      case 'observation':
        return <Thermometer className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Note['type']) => {
    switch (type) {
      case 'feeding':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'baking':
        return 'text-secondary-600 bg-secondary-50 border-secondary-200';
      case 'observation':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);

    if (minutes < 1) return t.timeAgo.justNow;
    if (minutes < 60) return t.timeAgo.minutesAgo.replace('{{minutes}}', minutes.toString());
    if (hours < 24) return t.timeAgo.hoursAgo.replace('{{hours}}', hours.toString());
    if (days < 7) return t.timeAgo.daysAgo.replace('{{days}}', days.toString());
    return t.timeAgo.weeksAgo.replace('{{weeks}}', weeks.toString());
  };

  return (
    <div className="min-h-screen bg-warmBg">
      <TopNav />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
                {t.title}
              </h1>
              <p className="text-text-secondary text-lg">
                {t.subtitle}
              </p>
            </div>
            {!isAddingNote && (
              <Button
                variant="primary"
                onClick={() => setIsAddingNote(true)}
                className="rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t.addNote}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Add/Edit Note Form */}
        {isAddingNote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card variant="elevated" className="border-2 border-primary-200">
              <CardHeader>
                <CardTitle className="text-xl">
                  {editingNoteId ? t.editNote : t.newNote}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Note Type */}
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      {t.noteType}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['feeding', 'baking', 'observation', 'general'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setNoteType(type)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            noteType === type
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 bg-white hover:border-primary-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getTypeIcon(type)}
                            <span className="text-sm font-medium">{t.types[type]}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      {t.noteTitle}
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder={t.noteTitlePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  {/* Optional fields for feeding */}
                  {noteType === 'feeding' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                          {t.temperature}
                        </label>
                        <input
                          type="number"
                          value={temperature}
                          onChange={(e) => setTemperature(e.target.value)}
                          placeholder={t.temperaturePlaceholder}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                          {t.ratio}
                        </label>
                        <input
                          type="text"
                          value={ratio}
                          onChange={(e) => setRatio(e.target.value)}
                          placeholder={t.ratioPlaceholder}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      {t.noteContent}
                    </label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder={t.noteContentPlaceholder}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="primary"
                      onClick={handleSaveNote}
                      disabled={!noteTitle.trim() || !noteContent.trim()}
                      className="flex-1 rounded-xl"
                    >
                      {t.save}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      className="rounded-xl"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.myNotes}
          </h2>

          {notes.length === 0 ? (
            <Card variant="soft" className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {t.noNotes}
                  </h3>
                  <p className="text-text-secondary">
                    {t.noNotesDesc}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setIsAddingNote(true)}
                  className="rounded-xl mt-2"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t.addNote}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-2 hover:border-primary-200 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center ${getTypeColor(note.type)}`}>
                          {getTypeIcon(note.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="font-display font-semibold text-text-primary text-lg mb-1">
                                {note.title}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatTimeAgo(note.timestamp)}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100">
                                  {t.types[note.type]}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditNote(note)}
                                className="rounded-lg"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(note.id)}
                                className="rounded-lg text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {(note.temperature || note.ratio) && (
                            <div className="flex gap-4 mb-3 text-sm">
                              {note.temperature && (
                                <span className="inline-flex items-center gap-1 text-text-secondary">
                                  <Thermometer className="w-4 h-4" />
                                  {note.temperature}°F
                                </span>
                              )}
                              {note.ratio && (
                                <span className="inline-flex items-center gap-1 text-text-secondary">
                                  <Droplet className="w-4 h-4" />
                                  {note.ratio}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <BottomTab />
    </div>
  );
}
