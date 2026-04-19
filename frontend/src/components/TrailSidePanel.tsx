import * as React from 'react';
import { useState } from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import type { Trail } from '../types/trail';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { dotClass: string; label: string }> = {
  open:              { dotClass: 'bg-[#16a34a]', label: 'Observed Dry'    },
  closed:            { dotClass: 'bg-destructive', label: 'Closed'          },
  "wet, don't ride": { dotClass: 'bg-destructive', label: "Wet, Don't Ride" },
  'update needed':   { dotClass: 'bg-muted-foreground', label: 'Needs Update' },
};

function getStatus(status: Trail['status']) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG['update needed'];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ── Trail list row ────────────────────────────────────────────────────────────

function TrailListItem({ trail }: { trail: Trail }) {
  const cfg = getStatus(trail.status);
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`size-[14px] rounded-full shrink-0 ${cfg.dotClass}`} />
        <span className="text-sm font-medium text-foreground truncate">{trail.name}</span>
      </div>
      <div className="flex items-center gap-4 shrink-0 ml-4">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{cfg.label}</span>
        <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(trail.lastUpdated)}</span>
      </div>
    </div>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

interface Props {
  trails: Trail[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TrailSidePanel({ trails, activeTab, onTabChange }: Props) {
  const [listCollapsed, setListCollapsed] = useState(false);

  const visible = [...trails]
    .filter(t => activeTab === 'open' ? t.status === 'open' : true)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`flex flex-col w-[530px] ${!listCollapsed ? 'h-full min-h-0' : ''}`}>
      <Card className={`rounded-lg shadow-lg border border-border gap-0 py-0 flex flex-col ${!listCollapsed ? 'flex-1 min-h-0' : ''}`}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <CardHeader className="px-6 pt-6 pb-4 gap-1.5 shrink-0">
          <CardTitle className="text-2xl font-semibold tracking-tight leading-none text-card-foreground">
            Austin trail conditions map
          </CardTitle>
          <CardDescription className="text-sm leading-5">
            A map view of Austin trail conditions.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setListCollapsed(c => !c)}
              aria-label={listCollapsed ? 'Expand trail list' : 'Collapse trail list'}
            >
              {listCollapsed ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
            </Button>
          </CardAction>
        </CardHeader>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div className="px-6 pb-4 shrink-0">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="w-full h-auto p-1">
              <TabsTrigger value="all" className="flex-1 py-1.5">All trails</TabsTrigger>
              <TabsTrigger value="open" className="flex-1 py-1.5">Open trails</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* ── Trail list — grid-rows collapse animation ───────────────────────── */}
        <div
          className="flex flex-col min-h-0 transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            display: 'grid',
            gridTemplateRows: listCollapsed ? '0fr' : '1fr',
            flex: listCollapsed ? undefined : '1 1 0',
          }}
        >
          <div className="overflow-hidden min-h-0 flex flex-col">
            <CardContent className="px-6 pb-2 flex-1 min-h-0 overflow-y-auto">
              {/* key change triggers fade-in when tab switches */}
              <div
                key={activeTab}
                className="flex flex-col gap-2 py-4 animate-in fade-in duration-200"
              >
                {visible.map(trail => (
                  <TrailListItem key={trail.id} trail={trail} />
                ))}
              </div>
            </CardContent>
          </div>
        </div>

      </Card>
    </div>
  );
}
