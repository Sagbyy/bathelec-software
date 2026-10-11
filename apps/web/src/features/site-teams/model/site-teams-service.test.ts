import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { siteTeamsService } from './site-teams-service';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const team = {
  id: 1,
  name: 'Équipe Nord',
  description: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('siteTeamsService', () => {
  afterEach(() => server.resetHandlers());

  it('lists teams with their members from /site-teams/with-users', async () => {
    server.use(
      http.get(`${BASE}/site-teams/with-users`, () =>
        HttpResponse.json([
          {
            ...team,
            teamMemberships: [
              {
                user: {
                  id: 7,
                  email: 'tech@x.fr',
                  username: 'tech',
                  firstName: 'Jean',
                  lastName: 'Dupont',
                  role: 'technician',
                  createdAt: '',
                },
              },
            ],
          },
        ])
      )
    );

    const data = await siteTeamsService.getAllTeamsWithUsers();

    expect(data[0].name).toBe('Équipe Nord');
    expect(data[0].teamMemberships[0].user.id).toBe(7);
  });

  it('creates a team with a POST to /site-teams', async () => {
    server.use(
      http.post(`${BASE}/site-teams`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ ...team, name: body.name });
      })
    );

    const data = await siteTeamsService.createTeam({
      name: 'Équipe Sud',
      description: 'Secteur sud',
    });

    expect(data.name).toBe('Équipe Sud');
  });

  it('adds a user to a team via /site-teams/:teamId/users/:userId', async () => {
    let calledPath = '';
    server.use(
      http.post(`${BASE}/site-teams/:teamId/users/:userId`, ({ params }) => {
        calledPath = `${params.teamId}/${params.userId}`;
        return HttpResponse.json({}, { status: 201 });
      })
    );

    await siteTeamsService.addUserToTeam(3, 9);

    expect(calledPath).toBe('3/9');
  });

  it('fetches the teams of a user via /site-teams/user/:userId/teams', async () => {
    server.use(
      http.get(`${BASE}/site-teams/user/:userId/teams`, () =>
        HttpResponse.json([team])
      )
    );

    const data = await siteTeamsService.getTeamsForUser(7);

    expect(data).toHaveLength(1);
  });

  it('throws when the server responds 403', async () => {
    server.use(
      http.delete(`${BASE}/site-teams/:teamId`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
      )
    );

    await expect(siteTeamsService.deleteTeam(1)).rejects.toThrow();
  });
});
