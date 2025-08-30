"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState, EmptyState } from "@/components/ui/loading-skeleton";
import { Star, Copy, Github, RefreshCw, Check } from "lucide-react";
import { useLeaderboard, type PeriodType, type SortType } from "@/hooks/useLeaderboard";
import { getAnimalEmoji } from "@/lib/supabase";

const formatTokens = (tokens: number) => {
  if (tokens >= 1000000000) {
    return `${(tokens / 1000000000).toFixed(1)}B`;
  } else if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toLocaleString();
};

const formatFullTokens = (tokens: number) => {
  return tokens.toLocaleString();
};

// Map tab values to hook period types
const mapTabToPeriod = (tab: string): PeriodType => {
  switch (tab) {
    case 'today': return 'today';
    case '7days': return '7days';
    case '30days': return '30days';
    case 'alltime': return 'alltime';
    default: return 'alltime';
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("alltime");
  const [sortBy] = useState<SortType>("tokens"); // We can add sorting controls later
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the real data hook
  const { data: leaderboardData, loading, error, totalCount, refetch } = useLeaderboard({
    period: mapTabToPeriod(activeTab),
    sortBy,
    limit: 25
  });

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="h-screen overflow-y-auto bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npx ccpet");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen overflow-y-auto bg-background">
      {/* Fixed Star on GitHub button in top-right */}
      <a href="https://github.com/terryso/ccpet" target="_blank" rel="noopener noreferrer">
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed top-2 right-2 md:top-4 md:right-4 z-50 flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3"
        >
          <Star className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden xs:inline">Star on GitHub</span>
          <span className="xs:hidden">Star</span>
        </Button>
      </a>
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-4 mt-12 md:mt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 tracking-tight">
            🐾 CCPET RANKING
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            Claude Code Virtual Pet Leaderboard
          </p>
        </div>

        {/* Installation Command */}
        <div className="mb-6 md:mb-8 flex justify-center px-4">
          <div className="flex items-center gap-2 bg-muted px-3 md:px-4 py-2 rounded-lg border max-w-full">
            <code className="text-xs sm:text-sm font-mono text-muted-foreground break-all">
              npx ccpet
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-auto p-1 shrink-0"
            >
              {copied ? <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-card border rounded-lg shadow-sm">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-3 md:px-6 pt-4 md:pt-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted h-auto">
                <TabsTrigger 
                  value="alltime" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 py-2"
                >
                  <span className="hidden sm:inline">All Time</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="30days" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 py-2"
                >
                  <span className="hidden sm:inline">Last 30 Days</span>
                  <span className="sm:hidden">30d</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="7days" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 py-2"
                >
                  <span className="hidden sm:inline">Last 7 Days</span>
                  <span className="sm:hidden">7d</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="today" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 py-2"
                >
                  Today
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Time Display */}
            <div className="text-center py-4">
              <div className="text-sm font-mono text-muted-foreground">
                Last updated: Just now
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {loading ? 'Loading...' : `${totalCount} pets competing`}
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading pets...</p>
                  </div>
                </div>
              ) : error ? (
                <ErrorState
                  title="Failed to load pets"
                  message={error}
                  onRetry={refetch}
                />
              ) : leaderboardData.length === 0 ? (
                <EmptyState
                  title="No pets found"
                  message="No pets found for this time period. Try a different time range or create some pets!"
                  icon="🐾"
                />
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="block md:hidden px-3 pb-4">
                    <div className="space-y-4">
                      {leaderboardData.map((pet) => (
                        <div key={pet.rank} className="bg-card rounded-lg p-4 border shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-lg font-semibold">
                                {pet.rank}
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="text-2xl">{getAnimalEmoji(pet.animal_type, pet.emoji)}</div>
                                <div className="font-semibold text-foreground">{pet.pet_name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-foreground">{formatTokens(pet.total_tokens)}</div>
                              <div className="text-xs text-muted-foreground">tokens</div>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-border/50">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Cost:</span>
                                  <span className="font-semibold">${pet.total_cost?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`font-semibold ${pet.is_alive ? 'text-green-600' : 'text-red-600'}`}>
                                    {pet.is_alive ? 'Alive' : 'Dead'}
                                  </span>
                                </div>
                              </div>
                              {pet.is_alive && (
                                <div className="text-xs text-muted-foreground">
                                  {pet.survival_days}d alive
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-muted/30">
                          <TableHead className="w-16 text-center font-semibold text-muted-foreground">RANK</TableHead>
                          <TableHead className="font-semibold text-muted-foreground">PET</TableHead>
                          <TableHead className="text-right font-semibold text-muted-foreground">
                            <div>Tokens</div>
                          </TableHead>
                          <TableHead className="text-right font-semibold text-muted-foreground w-24">
                            <div className="flex items-center justify-end gap-1">
                              Cost
                            </div>
                          </TableHead>
                          <TableHead className="text-right font-semibold text-muted-foreground w-32">
                            <div className="flex items-center justify-end gap-1">
                              Status
                            </div>
                          </TableHead>
                          <TableHead className="text-right font-semibold text-muted-foreground w-24">
                            <div className="flex items-center justify-end gap-1">
                              Survival
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {leaderboardData.map((pet) => (
                        <TableRow key={pet.rank} className="border-b border-border/50 hover:bg-muted/50">
                          <TableCell className="text-center font-semibold text-foreground py-4 align-middle">
                            <span className="text-lg">
                              {pet.rank}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 align-middle">
                            <span style={{fontSize: '24px', verticalAlign: 'middle', display: 'inline-block', lineHeight: '1', marginRight: '8px'}}>
                              {getAnimalEmoji(pet.animal_type, pet.emoji)}
                            </span>
                            <span className="font-medium text-foreground" style={{verticalAlign: 'middle', display: 'inline-block', lineHeight: '1'}}>
                              {pet.pet_name}
                            </span>
                          </TableCell>
                          <TableCell className="text-right align-middle">
                            <span className="font-semibold text-foreground">
                              {formatFullTokens(pet.total_tokens)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium text-foreground align-middle">
                            ${pet.total_cost.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right align-middle">
                            <span className={`text-sm font-medium whitespace-nowrap ${pet.is_alive ? 'text-green-600' : 'text-red-600'}`}>
                              {pet.is_alive ? '✅ Alive' : '💀 Dead'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right align-middle">
                            <span className="text-sm font-medium text-foreground">
                              {pet.survival_days}d
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-3 md:px-6 py-4 border-t border-border">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Showing {Math.min(leaderboardData.length, 25)} of {totalCount} pets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled className="text-xs px-3">
                        Previous
                      </Button>
                      <span className="text-xs sm:text-sm text-muted-foreground px-2">
                        Page 1 of {Math.ceil(totalCount / 25)}
                      </span>
                      <Button variant="outline" size="sm" disabled={totalCount <= 25} className="text-xs px-3">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Github className="w-4 h-4" />
            <a href="https://github.com/terryso/ccpet" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/stars/terryso/ccpet?style=social" alt="GitHub stars" />
            </a>
            <Badge variant="secondary" className="text-xs">🐾</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Real-time data • {totalCount} total pets • Powered by Supabase
          </div>
          <div className="text-xs text-muted-foreground">
            Keep your pets happy and they'll climb the ranks! 🚀
          </div>
        </div>
      </div>
    </div>
  );
}
