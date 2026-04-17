import * as React from 'react';
import { useState } from 'react';
import { Minimize2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import type { Trail } from '../types/trail';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { dotClass: string; label: string }> = {
  open:              { dotClass: 'bg-[#16a34a]', label: 'Observed Dry'    },
  closed:            { dotClass: 'bg-destructive', label: 'Closed'          },
  "wet, don't ride": { dotClass: 'bg-destructive', label: "Wet, Don't Ride" },
  'update needed':   { dotClass: 'bg-muted-foreground', label: 'Needs Updated' },
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
        <span className="text-sm text-muted-foreground">{cfg.label}</span>
        <span className="text-sm text-muted-foreground">{formatDate(trail.lastUpdated)}</span>
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

  const openCount   = trails.filter(t => t.status === 'open').length;
  const closedCount = trails.filter(t => t.status === 'closed').length;

  const visible = [...trails]
    .filter(t => activeTab === 'open' ? t.status === 'open' : true)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-4 w-[530px] h-full min-h-0">

      {/* ── Title & filter card ─────────────────────────────────────────────── */}
      <Card className="rounded-lg shadow-lg ring-0 border border-border gap-0 py-0">
        <CardHeader className="px-6 pt-6 pb-4 gap-1.5">
          <CardTitle className="text-2xl font-semibold tracking-tight leading-none text-card-foreground">
            Austin trail conditions map
          </CardTitle>
          <CardDescription className="text-sm leading-5">
            A map view of Austin trail conditions.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="w-full h-auto p-1">
              <TabsTrigger value="all" className="flex-1 py-1.5">All trails</TabsTrigger>
              <TabsTrigger value="open" className="flex-1 py-1.5">Open trails</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Trail list card ─────────────────────────────────────────────────── */}
      <Card className={`rounded-lg shadow-lg ring-0 border border-border gap-0 flex flex-col ${!listCollapsed ? 'flex-1 min-h-0' : ''}`}>
        <CardHeader className="px-6 pt-6 pb-0 shrink-0">
          <CardTitle className="text-2xl font-semibold tracking-tight leading-none text-card-foreground">
            {openCount} open trail{openCount !== 1 ? 's' : ''}
          </CardTitle>
          <CardDescription className="text-sm leading-5">
            {closedCount} closed trail{closedCount !== 1 ? 's' : ''}
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setListCollapsed(c => !c)}
              aria-label={listCollapsed ? 'Expand trail list' : 'Collapse trail list'}
            >
              <Minimize2 />
            </Button>
          </CardAction>
        </CardHeader>

        {!listCollapsed && (
          <CardContent className="px-6 pb-2 flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-2 py-4">
              {visible.map(trail => (
                <TrailListItem key={trail.id} trail={trail} />
              ))}
            </div>
          </CardContent>
        )}
      </Card>

    </div>
  );
}
