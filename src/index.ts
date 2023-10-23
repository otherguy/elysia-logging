import { type Elysia, type Context } from "elysia";
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import process from "process";

const NANOSECOND = 1;
const MICROSECOND = 1e3 * NANOSECOND;
const MILLISECOND = 1e3 * MICROSECOND;
const SECOND = 1e3 * MILLISECOND;
