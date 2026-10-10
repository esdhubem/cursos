import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import {
  Play,
  Pause,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  Award,
  Sparkles,
  ArrowLeft,
  Clock,
  BookOpen,
  Share2,
  Printer,
  ExternalLink,
  MessageSquare,
  Save,
  Volume2,
  Maximize2,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Calendar,
  QrCode,
  Network
} from 'lucide-react';
import { InteractiveMindMap } from './InteractiveMindMap';

interface StudentPortalPageProps {
  onBackToHome: () => void;
  onOpenValidator: () => void;
  initialCourseId?: string;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  onBackToHome,
  onOpenValidator,
  initialCourseId = 'hc-1'
}) => {
  // Enrolled courses (prioritizing Comunicação Assertiva and popular courses)
  const assertivaCourse = COURSES_DATA.find((c) => c.id === 'fp-assertiva');
  const enrolledCourses = [
    assertivaCourse || COURSES_DATA[0],
    ...COURSES_DATA.filter((c) => c.id !== 'fp-assertiva').slice(0, 2)
  ];
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || 'fp-assertiva');

  useEffect(() => {
    if (initialCourseId) {
      setSelectedCourseId(initialCourseId);
      setActiveLessonIndex(0);
    }
  }, [initialCourseId]);

  const currentCourse =
    COURSES_DATA.find((c) => c.id === selectedCourseId) || enrolledCourses[0];

  // Active module & lesson index
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');

  // Completed lessons state (defaults to first two completed)
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({
    'fp-assertiva': [0],
    'hc-1': [0, 1],
    'fp-1': [0, 1, 2],
    'fl-1': [0]
  });

  // Student notes
  const [studentNotes, setStudentNotes] = useState<string>(
    'Pontos-chave da aula: Comunicação assertiva requer escuta ativa e suspensão de pré-julgamentos. Aplicar as 4 etapas da CNV (Observação, Sentimento, Necessidade, Pedido) na reunião semanal de equipe.'
  );
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // Active tab in bottom pane
  const [activeBottomTab, setActiveBottomTab] = useState<'anotacoes' | 'materiais' | 'mapa_mental' | 'certificado' | 'duvidas'>('materiais');

  // Student info
  const [studentName, setStudentName] = useState('Silviano S.');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const currentCompletedList = completedLessons[currentCourse.id] || [];
  const totalLessons = currentCourse.syllabus.length;
  const progressPercent = Math.round((currentCompletedList.length / totalLessons) * 100);

  const toggleLessonCompleted = (index: number) => {
    const list = [...(completedLessons[currentCourse.id] || [])];
    if (list.includes(index)) {
      setCompletedLessons({
        ...completedLessons,
        [currentCourse.id]: list.filter((i) => i !== index)
      });
    } else {
      setCompletedLessons({
        ...completedLessons,
        [currentCourse.id]: [...list, index]
      });
    }
  };

  const handleSaveNotes = () => {
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Top Banner: Breadcrumb & Student Identity Bar */}
      <div className="bg-[#182333] text-white border-b border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Back button & Breadcrumb */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  onClick={onBackToHome}
                  className="hover:text-[#FFC72C] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Início</span>
                </button>
                <span>/</span>
                <span className="text-slate-300">Portal do Estudante</span>
                <span>/</span>
                <span className="text-[#FFC72C] font-semibold">Sala de Aula Virtual</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>Sala de Aula Virtual ESDHUBEM</span>
                <span className="bg-[#FFC72C] text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Ambiente do Aluno
                </span>
              </h1>
            </div>

            {/* Right: Student Profile Badge */}
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-2xl shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#FFC72C] text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
                SS
              </div>
              <div className="text-xs">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>{studentName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Online" />
                </p>
                <p className="text-slate-400 text-[11px]">Matrícula: ESD-2026-9812</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="bg-[#243042] text-white py-4 border-b border-slate-700/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#FFC72C]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Meus Cursos</p>
                <p className="text-base font-bold text-white">3 em andamento</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Progresso Médio</p>
                <p className="text-base font-bold text-white">{progressPercent}% concluído</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Carga Horária</p>
                <p className="text-base font-bold text-white">{currentCourse.hours}h ativas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-teal-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Certificados</p>
                <p className="text-base font-bold text-white">1 Disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Selection Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Selecione o Treinamento em Estudo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Alterne entre suas matrículas ativas para retomar as aulas instantaneamente.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-[#243042] hover:text-amber-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>+ Matricular-se em outros cursos do catálogo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs for enrolled courses */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {enrolledCourses.map((c) => {
            const isSelected = c.id === currentCourse.id;
            const cCompleted = (completedLessons[c.id] || []).length;
            const cTotal = c.syllabus.length;
            const cPercent = Math.round((cCompleted / cTotal) * 100);

            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setActiveLessonIndex(0);
                }}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#243042] shadow-md ring-2 ring-[#243042]/10'
                    : 'bg-slate-100 hover:bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      c.pillar === 'freepremium'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.pillar === 'horas-complementares'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {c.pillar === 'freepremium'
                      ? 'Freepremium'
                      : c.pillar === 'horas-complementares'
                      ? 'Horas Compl.'
                      : 'Formação Livre'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{c.hours}h</span>
                </div>

                <p className="text-sm font-bold text-slate-900 line-clamp-1 mb-2">
                  {c.title}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>{cCompleted} de {cTotal} aulas</span>
                    <span>{cPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#243042] h-full rounded-full transition-all duration-300"
                      style={{ width: `${cPercent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Classroom Layout (Video Player + Sidebar Lesson List) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Video Player & Tabs Pane (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Video Player Card */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
              
              {/* Video Screen */}
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={currentCourse.image}
                  alt={currentCourse.title}
                  className="w-full h-full object-cover opacity-40 blur-xs scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 flex flex-col justify-between p-6">
                  {/* Top Bar inside player */}
                  <div className="flex items-center justify-between text-white text-xs">
                    <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                      Aula {activeLessonIndex + 1} de {currentCourse.syllabus.length}
                    </span>
                    <span className="bg-black/60 px-2.5 py-1 rounded text-slate-300 font-mono">
                      HD 1080p
                    </span>
                  </div>

                  {/* Center Play/Pause Button */}
                  <div className="text-center space-y-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFC72C] hover:bg-amber-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-2xl mx-auto transition-transform cursor-pointer"
                      title={isPlaying ? 'Pausar aula' : 'Iniciar reprodução da videoaula'}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 fill-slate-950" />
                      ) : (
                        <Play className="w-8 h-8 fill-slate-950 ml-1" />
                      )}
                    </button>
                    <p className="text-white text-sm sm:text-base font-bold shadow-xs">
                      {currentCourse.syllabus[activeLessonIndex]}
                    </p>
                  </div>

                  {/* Bottom Timeline Controls */}
                  <div className="space-y-2">
                    {/* Scrubbing Bar */}
                    <div className="w-full bg-white/20 hover:bg-white/30 h-1.5 rounded-full cursor-pointer overflow-hidden">
                      <div className="bg-[#FFC72C] h-full w-2/5 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-[#FFC72C] cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <Volume2 className="w-4 h-4 text-slate-300" />
                        <span className="font-mono text-slate-300">14:20 / 32:45</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Speed button */}
                        <button
                          onClick={() => {
                            if (playbackSpeed === '1.0x') setPlaybackSpeed('1.25x');
                            else if (playbackSpeed === '1.25x') setPlaybackSpeed('1.5x');
                            else setPlaybackSpeed('1.0x');
                          }}
                          className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          {playbackSpeed}
                        </button>
                        <Maximize2 className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info Header below video */}
              <div className="p-5 bg-slate-900 border-t border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#FFC72C] uppercase tracking-wider">
                    {currentCourse.category}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold">
                    {currentCourse.syllabus[activeLessonIndex]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentCourse.id === 'fp-assertiva'
                      ? 'Professora Silviane Silvério • Especialista em Práticas Integrativas & Liderança'
                      : 'Corpo Docente ESDHUBEM • Material Didático e Prático Incluso'}
                  </p>
                </div>

                {/* Mark as completed button */}
                <button
                  onClick={() => toggleLessonCompleted(activeLessonIndex)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    currentCompletedList.includes(activeLessonIndex)
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      : 'bg-[#FFC72C] hover:bg-amber-400 text-slate-950 shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {currentCompletedList.includes(activeLessonIndex)
                      ? 'Aula Concluída'
                      : 'Concluir esta Aula'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Support Panels: Tabs (Materiais, Anotações, Certificado, Dúvidas) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              {/* Tab selector */}
              <div className="flex border-b border-slate-200 pb-3 gap-3 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveBottomTab('materiais')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeBottomTab === 'materiais'
                      ? 'border-[#243042] text-[#243042]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Materiais & Apostila</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('anotacoes')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeBottomTab === 'anotacoes'
                      ? 'border-[#243042] text-[#243042]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Minhas Anotações</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('mapa_mental')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeBottomTab === 'mapa_mental'
                      ? 'border-[#243042] text-[#243042] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Network className="w-4 h-4 text-indigo-600" />
                  <span>🧠 Mapa Mental da Aula</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('certificado')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeBottomTab === 'certificado'
                      ? 'border-[#243042] text-[#243042]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#FFC72C]" />
                  <span>Certificado Oficial</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('duvidas')}
                  className={`pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeBottomTab === 'duvidas'
                      ? 'border-[#243042] text-[#243042]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Dúvidas com Tutor</span>
                </button>
              </div>

              {/* Tab 1: Materiais de Apoio */}
              {activeBottomTab === 'materiais' && (
                <div className="pt-5 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      Arquivos e Apostilas Complementares
                    </h4>
                    <p className="text-xs text-slate-500">
                      Faça o download dos documentos oficiais para acompanhar os estudos sem depender de conexão.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#243042] text-[#FFC72C] flex items-center justify-center font-bold text-xs">
                          PDF
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Apostila Completa ESDHUBEM</p>
                          <p className="text-[11px] text-slate-400">PDF • 4.8 MB • 64 páginas</p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert('Download da Apostila Oficial iniciado!')}
                        className="p-2 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Baixar Apostila"
                      >
                        <Download className="w-4 h-4 text-[#243042]" />
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#182333] text-emerald-400 flex items-center justify-center font-bold text-xs">
                          DOC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Caderno de Exercícios Práticos</p>
                          <p className="text-[11px] text-slate-400">DOCX • 1.2 MB • Estudo de Caso</p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert('Download do Caderno de Exercícios iniciado!')}
                        className="p-2 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Baixar Exercícios"
                      >
                        <Download className="w-4 h-4 text-[#243042]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Minhas Anotações */}
              {activeBottomTab === 'anotacoes' && (
                <div className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Caderno de Notas da Aula
                      </h4>
                      <p className="text-xs text-slate-500">
                        Suas anotações ficam salvas localmente para consulta a qualquer momento.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3.5 py-1.5 rounded-lg bg-[#243042] hover:bg-[#182333] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5 text-[#FFC72C]" />
                      <span>Salvar Anotações</span>
                    </button>
                  </div>

                  <textarea
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    rows={5}
                    placeholder="Digite suas percepções, insights e reflexões desta aula..."
                    className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#243042] text-slate-800 font-sans leading-relaxed"
                  />

                  {notesSavedAlert && (
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Anotações salvas com sucesso!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Mapa Mental Interativo */}
              {activeBottomTab === 'mapa_mental' && (
                <InteractiveMindMap
                  courseId={currentCourse.id}
                  lessonIndex={activeLessonIndex}
                  lessonTitle={currentCourse.syllabus[activeLessonIndex] || 'Aula Atual'}
                />
              )}

              {/* Tab 3: Certificado Oficial */}
              {activeBottomTab === 'certificado' && (
                <div className="pt-5 space-y-5">
                  <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Certificação Oficial ESDHUBEM (Lei 9.394/96)</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Seu certificado contém carga horária de <strong>{currentCourse.hours} horas</strong>, código alfanumérico com validação pública e QR Code com hash de segurança.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="bg-[#243042] hover:bg-[#182333] text-[#FFC72C] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Award className="w-4 h-4" />
                      <span>Visualizar Certificado</span>
                    </button>
                  </div>

                  {/* Certificate Preview Card */}
                  <div className="border-2 border-slate-300 rounded-2xl p-6 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[#243042] text-[#FFC72C] flex items-center justify-center font-black text-xs">
                          ES
                        </div>
                        <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                          ESDHUBEM • Certificado de Conclusão
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        CÓDIGO: ESDHUBEM-2026-HC40
                      </span>
                    </div>

                    <div className="text-center py-4 space-y-2">
                      <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                        Certificamos que
                      </p>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        {studentName}
                      </h3>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        concluiu com êxito o curso de aperfeiçoamento em{' '}
                        <strong>{currentCourse.title}</strong> com carga horária total de{' '}
                        <strong>{currentCourse.hours} horas</strong>.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                      <span>São Paulo - SP • CNPJ 61928778000150</span>
                      <div className="flex gap-2">
                        <button
                          onClick={onOpenValidator}
                          className="text-[#243042] font-bold hover:underline cursor-pointer"
                        >
                          Consultar Validade Pública
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Dúvidas com o Tutor */}
              {activeBottomTab === 'duvidas' && (
                <div className="pt-5 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Canal Direto com a Tutoria Pedagógica
                    </h4>
                    <p className="text-xs text-slate-500">
                      Envie sua pergunta técnica ou acadêmica sobre o curso "{currentCourse.title}".
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Título da sua dúvida..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#243042]"
                    />
                    <textarea
                      rows={3}
                      placeholder="Descreva sua dúvida com detalhes..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#243042]"
                    />
                    <button
                      onClick={() => alert('Dúvida enviada ao tutor pedagógico! Você receberá a resposta em seu e-mail cadastrado.')}
                      className="px-5 py-2.5 rounded-xl bg-[#243042] text-white text-xs font-bold hover:bg-[#182333] transition-colors cursor-pointer"
                    >
                      Enviar Dúvida ao Professor
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right: Interactive Syllabus & Lesson Navigator (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Grade de Aulas & Módulos
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentCompletedList.length} de {totalLessons} concluídas ({progressPercent}%)
                  </p>
                </div>

                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {totalLessons}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-[#243042] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Lesson Items List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {currentCourse.syllabus.map((lessonTitle, idx) => {
                  const isActive = idx === activeLessonIndex;
                  const isDone = currentCompletedList.includes(idx);

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isActive
                          ? 'bg-[#243042] text-white border-[#243042] shadow-sm'
                          : isDone
                          ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-800 hover:bg-emerald-50'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white text-slate-700'
                      }`}
                    >
                      {/* Checkbox trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonCompleted(idx);
                        }}
                        className="mt-0.5 shrink-0 cursor-pointer"
                        title={isDone ? 'Desmarcar' : 'Marcar como concluída'}
                      >
                        {isDone ? (
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isActive ? 'text-[#FFC72C]' : 'text-emerald-600'
                            }`}
                          />
                        ) : (
                          <Circle
                            className={`w-4 h-4 ${
                              isActive ? 'text-slate-400' : 'text-slate-400'
                            }`}
                          />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className={isActive ? 'text-amber-300 font-bold' : 'text-slate-400 font-semibold'}>
                            Aula {idx + 1}
                          </span>
                          <span className={isActive ? 'text-slate-300' : 'text-slate-400'}>
                            25 min
                          </span>
                        </div>
                        <p
                          className={`text-xs font-semibold leading-snug line-clamp-2 ${
                            isActive ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {lessonTitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Help */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Carga horária averbada ao completar 100% das aulas.</span>
                </div>
                <button
                  onClick={onOpenValidator}
                  className="text-xs font-bold text-[#243042] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Validar código de certificado</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Support box */}
            <div className="bg-[#182333] text-white rounded-2xl p-5 border border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#FFC72C] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Suporte ao Aluno</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Precisa de ajuda com prazos de entrega, declaração de matrícula ou emissão em papel moeda?
              </p>
              <a
                href="https://wa.me/5511960319637"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
              >
                <span>Falar via WhatsApp: (11) 960319637</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Full Certificate Modal Preview */}
      {showCertificateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-4 border-[#243042] text-slate-900 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#243042] text-[#FFC72C] flex items-center justify-center font-black">
                  ES
                </div>
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-wider text-slate-900">
                    ESDHUBEM - Escola de Desenvolvimento Humano e Bem-estar
                  </h3>
                  <p className="text-xs text-slate-500">
                    CNPJ 61928778000150 • São Paulo SP Brasil • Registrado sob Lei 9.394/96
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Certificate Core Visual */}
            <div className="text-center py-6 px-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest mb-4">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Certificado Oficial de Conclusão</span>
              </div>

              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">
                Certificamos para os devidos fins legais que
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243042] mb-3">
                {studentName}
              </h2>

              <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-4">
                concluiu satisfatoriamente todas as etapas e avaliações do curso de extensão e treinamento em{' '}
                <strong>{currentCourse.title}</strong>, perfazendo uma carga horária total de{' '}
                <strong>{currentCourse.hours} horas</strong> de estudos orientados.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 max-w-lg mx-auto pt-3 border-t border-slate-200">
                <div>
                  <span className="block text-slate-400 font-medium text-[10px] uppercase">Carga Horária</span>
                  <span className="font-bold text-slate-800">{currentCourse.hours} Horas</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium text-[10px] uppercase">Emissão</span>
                  <span className="font-bold text-slate-800">20/09/2026</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium text-[10px] uppercase">Código</span>
                  <span className="font-mono font-bold text-slate-800">ESDHUBEM-2026-HC40</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium text-[10px] uppercase">Autenticidade</span>
                  <span className="font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Válido
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Footer Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Hash: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={() => alert('Download do Certificado Oficial em PDF iniciado!')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#243042] hover:bg-[#182333] text-[#FFC72C] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF Oficial</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
