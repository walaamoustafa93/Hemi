'use client';
import { useState, useEffect, useTransition } from 'react';
import { DashboardGridComponent } from './dashboard-grid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Save } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface DashboardItem {
  id: string;
  // type: 'BigData' | 'Chart';
  name: string;
  value: string;
  width: string;
  background: string;
}
const predefinedCharts = [
  { id: 0, name: 'Chart 1' },
  { id: 1, name: 'Chart 2' },
  { id: 2, name: 'Chart 3' },
  { id: 3, name: 'Chart 4' },
  { id: 4, name: 'Chart 5' },
  { id: 5, name: 'Chart 6' },
  { id: 6, name: 'Chart 7' },
  { id: 7, name: 'Chart 8' },
];
interface DashboardProps {
  ProjectId?: number | null;
}
export const DashboardWrapper = ({ ProjectId }: DashboardProps) => {
  // const [predefinedCharts,setPredefinedCharts]=useState([])
  const [cards, setCards] = useState<DashboardItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const edit = searchParams.get('edit');
  const [isPending, startTransition] = useTransition();

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getCharts = async () => {
  //     try {
  //       const data = await fetch(`https://localhost:7219/api/Charts`);
  //       const result = await data.json();
  //       setPredefinedCharts(result);
  //     } catch (error) {
  //       console.error('Error fetching projects:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getCharts();
  // }, []);

  // if (loading) return <p>Loading...</p>;
  const usedChartsIds = cards.map((card) => Number(card.id));
  const availableCharts = predefinedCharts.filter(
    (chart) => !usedChartsIds.includes(chart.id)
  );
  const addChart = (chartName: string) => {
    const selectedChart = predefinedCharts.find(
      (chart) => chart.name === chartName
    );
    console.log({ selectedChart });
    if (!selectedChart) return;

    const newChart = {
      id: selectedChart.id.toString(),
      type: 'Chart',
      name: chartName,
      value: 'Loading visualization...',
      width: 'col-span-2',
      background: 'rgb(255,255,255)',
    };

    setCards((prev) => [...prev, newChart]);
    setIsChartDialogOpen(false);
  };
  // const addChart = (chartName: string) => {
  //   const newChart = {
  //     id: crypto.randomUUID(),
  //     type: 'Chart',
  //     name: chartName,
  //     value: 'Loading visualization...',
  //     width: 'col-span-2',
  //     background: 'white',
  //   };
  //   setCards((prev) => [...prev, newChart]);
  //   setIsChartDialogOpen(false); // Close dialog after adding
  // };

  // Check if the "Add" buttons should be disabled
  const isAddChartDisabled = availableCharts.length === 0;

  // Load from localStorage
  useEffect(() => {
    const loadState = () => {
      try {
        const saved = localStorage.getItem('dashboardState');
        if (saved) setCards(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };
    loadState();
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardState', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (edit == 'true') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [edit]);

  // Handle reordering of cards
  const handleReorder = (newCards: DashboardItem[]) => {
    setCards(newCards);
  };
  function handleSaveCard() {
    console.log({ ProjectId });
    console.log({ cards });
    startTransition(async () => {
      try {
        const response = await fetch(
          `https://localhost:7219/api/projects/1/dashboards`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cards),
          }
        );
        const result = await response.json();
        console.log({ result });
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <section className="p-4 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Analytics Dashboard
          </h1>
          <div className="flex gap-2">
            {isEditMode && (
              <>
                <Button
                  onClick={() => setIsChartDialogOpen(true)}
                  disabled={isAddChartDisabled}
                  className={`bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-sm transition-colors flex items-center ${
                    isAddChartDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Choose Chart</span> <Pencil className="!w-4 !h-4" />
                </Button>

                <Button
                  className="px-1"
                  disabled={isPending}
                  onClick={handleSaveCard}
                >
                  <Save size={16} />
                </Button>
              </>
            )}
          </div>
        </header>

        <DashboardGridComponent
          cards={cards}
          onReorder={handleReorder}
          isEditMode={isEditMode}
        />

        {/* Popup Dialog */}
        <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
          <DialogContent>
            <DialogTitle className="">Select a Chart</DialogTitle>
            <div className="space-y-2.5">
              {availableCharts.map((chart) => (
                <Button
                  key={chart.id}
                  onClick={() => addChart(chart.name)}
                  className="w-full bg-gray-100 rounded py-6 text-lg text-gray-800 hover:bg-gray-700 hover:text-white duration-200 transition-colors"
                >
                  {chart.name}
                </Button>
              ))}
            </div>
            <DialogClose asChild>
              <div className="flex items-center justify-center">
                <Button
                  variant="destructive"
                  className="rounded flex items-center justify-center"
                >
                  Cancel
                </Button>
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
