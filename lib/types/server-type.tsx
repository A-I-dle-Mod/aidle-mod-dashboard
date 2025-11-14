export type Message = {
  id: number;
  message_id: number;
  author_name: string;
  score: number;
  created_date: string;
  guild: Server;
};

export type MessagesResponse = {
  data: Message[];
  status: string;
}

export type Server = {
  id: number;
  guild_id: number;
  guild_icon: string;
  guild_name: string;
  messages: Message[];
  created_date: string;
};

export type ServerResponse = {
  guild: Server;
  status: string;
};

export type ServersResponse = {
  guilds: Server[];
  status: string;
};