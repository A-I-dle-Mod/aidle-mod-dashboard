import { Server } from './server-type';

export type Plan = {
  id: number;
  max_requests: number;
};

export type Me = {
  id: number;
  owner_id: number;
  owner_icon: string;
  owner_name: string;
  guilds: Server[];
  plan: Plan;
};
