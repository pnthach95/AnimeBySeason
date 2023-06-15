type TLanguage = 'en' | 'vi';

type StoreState = {
  bundleVersion: string;
  appTheme: 'dark' | 'light';
  appLanguage: TLanguage;
};

type BaseAPIResponse<T = null> = {
  message: string;
  data: T;
  msg: string;
};

type TCompanyHeadquarter = {
  address: string;
  city: string;
  state: string;
};

type TCompanyLink = {
  website: string;
  flickr: string;
  twitter: string;
  elon_twitter: string;
};

type TCompany = {
  headquarters: TCompanyHeadquarter;
  links: TCompanyLink;
  name: string;
  founder: string;
  founded: number;
  employees: number;
  vehicles: number;
  launch_sites: number;
  test_sites: number;
  ceo: string;
  cto: string;
  coo: string;
  cto_propulsion: string;
  valuation: number;
  summary: string;
  id: string;
};

type TPatch = {
  small?: string;
  large?: string;
};

type TReddit = {
  campaign?: string;
  launch?: string;
  media?: string;
  recovery?: string;
};

type TFlickr = {
  small: string[];
  original: string[];
};

type TLaunchLink = {
  patch: TPatch;
  reddit: TReddit;
  flickr: TFlickr;
  presskit?: string;
  webcast?: string;
  youtube_id?: string;
  article?: string;
  wikipedia?: string;
};

type TLaunchCore = {
  core: string;
  flight: number;
  gridfins: boolean;
  legs: boolean;
  reused: boolean;
  landing_attempt: boolean;
  landing_success: boolean;
  landing_type: string;
  landpad: string;
};

type TLaunchData = {
  fairings: {
    reused?: boolean;
    recovery_attempt?: boolean;
    recovered?: boolean;
    ships: string[];
  };
  links: TLaunchLink;
  static_fire_date_utc?: string;
  static_fire_date_unix?: number;
  tdb: boolean;
  net: boolean;
  window?: number;
  rocket?: string;
  success?: boolean;
  failures: {
    time: number;
    altitude: number;
    reason: string;
  }[];
  details?: string;
  crew: string[];
  ships: string[];
  capsules: string[];
  payloads: string[];
  launchpad?: string;
  auto_update: boolean;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: 'half' | 'quarter' | 'year' | 'month' | 'day' | 'hour';
  upcoming: boolean;
  cores: TLaunchCore[];
  id: string;
};

type TRocketStage = {
  reusable?: boolean;
  engines?: number;
  fuel_amount_tons?: number;
  burn_time_sec?: number;
  thrust_sea_level?: {
    kN?: number;
    lbf?: number;
  };
  thrust_vacuum?: {
    kN?: number;
    lbf?: number;
  };
};

type THeightData = {
  meters?: number;
  feet?: number;
};

type TWeightData = {
  kg?: number;
  lb?: number;
};

type TForceData = {
  kN?: number;
  lbf?: number;
};

type TRocketData = {
  name?: string;
  type?: string;
  active?: boolean;
  stages?: number;
  boosters?: number;
  cost_per_launch?: number;
  success_rate_pct?: number;
  first_flight?: string;
  country?: string;
  company?: string;
  height?: THeightData;
  diameter?: THeightData;
  mass?: TWeightData;
  payload_weights?: ({id: string; name: string} & TWeightData)[];
  first_stage?: TRocketStage;
  second_stage?: TRocketStage & {
    payloads?: {
      option_1?: string;
      composite_fairing?: {
        height?: THeightData;
        diameter?: THeightData;
      };
    };
  };
  engines?: {
    number?: number;
    type?: string;
    version?: string;
    layout?: string;
    isp?: {
      sea_level?: number;
      vacuum?: number;
    };
    engine_loss_max?: number;
    propellant_1?: string;
    propellant_2?: string;
    thrust_sea_level?: TForceData;
    thrust_vacuum?: TForceData;
    thrust_to_weight?: number;
  };
  landing_legs?: {
    number?: number;
    material?: object;
  };
  flickr_images?: string[];
  wikipedia?: string;
  description?: string;
};

type TLaunchPadData = {
  name: string | null;
  full_name: string | null;
  status:
    | 'active'
    | 'inactive'
    | 'unknown'
    | 'retired'
    | 'lost'
    | 'under construction';
  locality: string | null;
  region: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[];
  launches: string[];
  images: {large: string[]} | null;
  details: string;
};
