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

export type Settings = {
  id: number;
  enable_h: boolean;
  enable_h2: boolean;
  enable_hr: boolean;
  enable_s: boolean;
  enable_s3: boolean;
  enable_sh: boolean;
  enable_v: boolean;
  enable_v2: boolean;
  confidence_limit: number;
  moderation_message: string;
  updated_date: Date;
}

export type Server = {
  id: number;
  guild_id: number;
  guild_icon: string;
  guild_name: string;
  messages: Message[];
  settings: Settings;
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