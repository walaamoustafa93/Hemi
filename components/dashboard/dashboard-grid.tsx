'use client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Pencil, Grip } from 'lucide-react';
import { useCallback, useState } from 'react';

interface DashboardItem {
  id: string;
  background: string;
  name: string;
  value: string;
  width: string;
}

interface DashboardGridProps {
  cards: DashboardItem[];
  onReorder: (newCards: DashboardItem[]) => void;
  isEditMode: boolean;
}

export const DashboardGridComponent = ({
  cards,
  onReorder,
  isEditMode,
}: DashboardGridProps) => {
  const [activeItem, setActiveItem] = useState<DashboardItem | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ active }: any) => {
      const item = cards.find((i) => i.id === active.id);
      if (item) setActiveItem(item);
    },
    [cards]
  );

  const handleDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ active, over }: any) => {
      setActiveItem(null);
      if (over && active.id !== over.id) {
        const oldIndex = cards.findIndex((i) => i.id === active.id);
        const newIndex = cards.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(cards, oldIndex, newIndex);
        onReorder(reordered);
      }
    },
    [cards, onReorder]
  );

  const deleteCard = (cardId: string) => {
    onReorder(cards.filter((card) => card.id !== cardId));
  };

  const updateCard = (cardId: string, updatedProps: Partial<DashboardItem>) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, ...updatedProps } : card
    );
    onReorder(updatedCards);
  };

  // Custom drop animation
  const customDropAnimation = {
    ...defaultDropAnimation, // Start with default settings
    duration: 300, // Increase duration for a slower animation
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)', // Custom easing function
  };

  return (
    <div className="space-y-4">
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={cards} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
              {cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  onDelete={deleteCard}
                  onUpdate={updateCard}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </SortableContext>

          {/* Drag Overlay with custom drop animation */}
          <DragOverlay dropAnimation={customDropAnimation}>
            {activeItem ? (
              <div className="bg-white p-4 rounded-xl shadow-lg w-full">
                <h3 className="font-medium text-slate-800">
                  {activeItem.name}
                </h3>
                <p className="text-sm text-slate-500">{activeItem.value}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        // Render cards without DnD functionality when edit mode is disabled
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onDelete={deleteCard}
              onUpdate={updateCard}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SortableCard = ({
  card,
  onDelete,
  onUpdate,
  isEditMode,
}: {
  card: DashboardItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedProps: Partial<DashboardItem>) => void;
  isEditMode: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(card.name);
  const [value, setValue] = useState(card.value);
  const [width, setWidth] = useState(card.width);
  const [background, setBackground] = useState(card.background);
  const handleSave = () => {
    onUpdate(card.id, { name, value, width, background });
    setIsEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    background: background || 'rgb(255,255,255)',
  };
  console.log({ background });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${card.width}  py-3 px-0 rounded-md shadow-sm hover:shadow-md transition-all`}
    >
      {isEditMode && (
        <div
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          <Grip className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {isEditMode && (
        <button
          onClick={() => onDelete(card.id)}
          className="absolute bottom-1.5 right-1.5 p-1 hover:bg-slate-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      )}

      <div className="space-y-2 p-4">
        {isEditMode && isEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            />
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            />

            <select
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            >
              <option value={'col-span-2'} className="text-sm">
                {' '}
                1 Column
              </option>
              <option value={'col-span-4'} className="text-sm">
                {' '}
                2 Columns
              </option>
              <option value={'col-span-6'} className="text-sm">
                {' '}
                3 Columns
              </option>
              <option value={'col-span-8'} className="text-sm">
                {' '}
                4 Columns
              </option>
              <option value={'col-span-10'} className="text-sm">
                5 Columns
              </option>
              <option value={'col-span-12'} className="text-sm">
                6 Columns
              </option>
            </select>

            {/* Color Picker */}
            <label className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <input
              type="color"
              value={background}
              // defaultValue={'rgb(255,255,255)'}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full h-10 p-1 border rounded cursor-pointer"
            />

            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-3 py-1.5 rounded"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h3 className="font-medium text-slate-800">{card.name}</h3>
            <p className="text-sm text-slate-500">{card.value}</p>
            {isEditMode && (
              <button
                onClick={() => setIsEditing(true)}
                className=" text-blue-700 px-1.5 py-1 text-sm  flex items-center gap-2 absolute right-1 top-0"
              >
                <Pencil size={16} />
                {/* <span>Edit</span> <Pencil size={16} /> */}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Utility function
function arrayMove<T>(array: T[], from: number, to: number) {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}
