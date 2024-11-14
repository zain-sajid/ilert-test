'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { fetcherWithAuthHeader } from '@/lib/fetcher';
import { mutateData } from '@/lib/request';
import { ChevronDown } from 'lucide-react';
import useSWR from 'swr';
import { Skeleton } from './ui/skeleton';

export default function TeamSelector() {
  const {
    data: user,
    isLoading: userLoading,
    mutate
  } = useSWR<User>('/api/users/current', fetcherWithAuthHeader);
  const teamContext = user?.teamContext;

  const { data: teams, isLoading: teamsLoading } = useSWR<Team[]>(
    '/api/teams',
    fetcherWithAuthHeader
  );
  const selectedTeam = teams?.find((team) => team.id === teamContext);

  async function switchTeam(teamId: number) {
    if (!user) return;

    await mutateData(
      '/api/users/current/team-context',
      { context: teamId },
      'PUT'
    );
    mutate({
      ...user,
      teamContext: teamId
    });
  }

  if (userLoading || teamsLoading) {
    return (
      <div className="p-2">
        <Skeleton className="h-full w-20 bg-white/25" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-white">
        <div className="flex items-center gap-1 p-2">
          {selectedTeam?.name || 'All teams'}
          <ChevronDown className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {teamContext !== 0 && (
          <DropdownMenuItem
            onClick={() => {
              switchTeam(0);
            }}
          >
            All teams
          </DropdownMenuItem>
        )}

        {teams
          ?.filter((t) => teamContext !== t.id)
          .map((team) => (
            <DropdownMenuItem
              key={team.id}
              onClick={() => {
                switchTeam(team.id);
              }}
            >
              {team.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
