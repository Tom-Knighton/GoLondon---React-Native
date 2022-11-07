import { StopPoint } from "./GLPoint";

export interface Branch {
    lineId?: string | null;
    lineName?: string | null;
    /** @format int32 */
    branchId?: number;
    nextBranchIds?: number[] | null;
    prevBranchIds?: number[] | null;
    stopPoint?: StopPoint[] | null;
  }

  export interface Departure {
    platformName?: string | null;
    vehicleId?: string | null;
    lineId?: string | null;
    lineMode?: LineMode;
    destinationName?: string | null;
    destinationNaptan?: string | null;
    /** @format date-time */
    estimatedArrival?: string | null;
    /** @format date-time */
    estimatedDeparture?: string | null;
    /** @format date-time */
    scheduledArrival?: string | null;
    /** @format date-time */
    scheduledDeparture?: string | null;
    status?: string | null;
    towards?: string | null;
    canonicalDirection?: string | null;
    tubeDirection?: string | null;
    currentLocation?: string | null;
    /** @format int32 */
    stopBearing?: number | null;
    stationName?: string | null;
    naptanId?: string | null;
  }

  export interface DepartureLineGroup {
    lineId?: string | null;
    lineMode?: LineMode;
    platformGroups?: DeparturePlatformGroup[] | null;
  }

  export interface DeparturePlatformGroup {
    platform?: string | null;
    direction?: string | null;
    canonicalDirection?: string | null;
    departures?: Departure[] | null;
  }

  export interface Disruption {
    description?: string | null;
    /** @format date-time */
    created?: string | null;
    /** @format date-time */
    lastUpdate?: string | null;
    affectedRoutes?: LineRoute[] | null;
    closureText?: string | null;
    delayType?: DisruptionDelayType;
  }

  export enum DisruptionDelayType {
    NoDelays = "No Delays",
    MinorDelays = "Minor Delays",
    SevereDelays = "Severe Delays",
    PlannedClosure = "Planned Closure",
  }

  export interface InternalStopPointProperty {
    category?: string | null;
    key?: string | null;
    value?: string | null;
  }

  export interface Journey {
    /** @format date-time */
    startDateTime?: string | null;
    /** @format date-time */
    arrivalDateTime?: string | null;
    /** @format int32 */
    duration?: number;
    legs?: JourneyLeg[] | null;
    modes?: string[] | null;
  }

  export enum JourneyDateType {
    ArriveAt = "Arrive At",
    DepartAt = "Depart At",
  }

  export interface JourneyLeg {
    instruction?: JourneyLegInstruction;
    /** @format date-time */
    departureTime?: string | null;
    /** @format date-time */
    arrivalTime?: string | null;
    departurePoint?: StopPoint;
    arrivalPoint?: StopPoint;
    path?: JourneyLegPath;
    routeOptions?: JourneyLegRouteOption[] | null;
    mode?: JourneyMode;
    disruptions?: Disruption[] | null;
    isDisrupted?: boolean;
    hasFixedLocations?: boolean;
  }

  export interface JourneyLegInstruction {
    summary?: string | null;
    detailed?: string | null;
  }

  export interface JourneyLegPath {
    lineString?: string | null;
    stopPoints?: StopPoint[] | null;
  }

  export interface JourneyLegRouteOption {
    name?: string | null;
    directions?: string[] | null;
    lineIdentifier?: Line;
  }

  export interface JourneyMode {
    id?: string | null;
    name?: string | null;
    type?: string | null;
  }

  export interface Line {
    id?: string | null;
    name?: string | null;
    modeName?: string | null;
    distruptions?: Disruption[] | null;
    lineStatuses?: LineStatus[] | null;
    currentStatus?: LineStatus;
  }

  export enum LineDirection {
    Inbound = "inbound",
    Outbound = "outbound",
  }

  export interface LineGroup {
    naptanIdReference?: string | null;
    lineIdentifier?: string[] | null;
  }

  export enum LineMode {
    Unk = "unk",
    Tube = "tube",
    Bus = "bus",
    Dlr = "dlr",
    NationalRail = "national-rail",
    InternationalRail = "international-rail",
    Overground = "overground",
    ElizabethLine = "elizabeth-line",
    ReplacementBus = "replacement-bus",
    CableCar = "cable-car",
    Tram = "tram",
  }

  export interface LineModeGroup {
    modeName?: LineMode;
    lineIdentifier?: string[] | null;
  }

  export enum LineModeGroupStatusType {
    AllLinesAreReportingGoodService = "All lines are reporting Good Service",
    MostLinesAreReportingGoodService = "Most lines are reporting Good Service",
    SomeLinesAreReportingProblems = "Some lines are reporting problems",
    ManyLinesAreReportingProblems = "Many lines are reporting problems",
    AllLinesAreReportingProblems = "All lines are reporting problems",
    UnableToDetermineServiceStatus = "Unable to determine service status.",
  }

  export interface LineRoute {
    id?: string | null;
    name?: string | null;
    direction?: string | null;
    originationName?: string | null;
    destinationName?: string | null;
  }

  export interface LineRoutes {
    lineId?: string | null;
    lineName?: string | null;
    stopPointSequences?: Branch[] | null;
    direction?: LineDirection;
    lineStrings?: string[] | null;
    lineMapRoutes?: number[][][] | null;
  }

  export interface LineStatus {
    id?: string | null;
    lineId?: string | null;
    /** @format int32 */
    statusSeverity?: number;
    statusSeverityDescription?: string | null;
    reason?: string | null;
    /** @format date-time */
    created?: string | null;
    validityPeriods?: LineStatusValidityPeriod[] | null;
    disruption?: Disruption;
  }

  export interface LineStatusValidityPeriod {
    /** @format date-time */
    fromDate?: string;
    /** @format date-time */
    toDate?: string;
    isNow?: boolean;
  }

  export interface Point {
    /** @format float */
    lat?: number;
    /** @format float */
    lon?: number;
    pointType?: string | null;
  }



  export interface StopPointCrowding {
    containsDaily?: boolean;
    dailyCrowding?: Record<string, string>;
    generalWeeklyCrowding?: string | null;
    generalWeekendCrowding?: string | null;
  }

  export interface StopPointProperty {
    name?: string | null;
    value?: string | null;
  }

  export interface StopPointTimetable {
    lineId?: string | null;
    stopPointId?: string | null;
    direction?: string | null;
    schedules?: TimetableSchedule[] | null;
  }

  export interface TimetableEntry {
    terminatingAt?: string | null;
    /** @format int32 */
    id?: number;
    /** @format date-time */
    time?: string;
  }

  export interface TimetableSchedule {
    name?: string | null;
    towards?: string[] | null;
    entries?: TimetableEntry[] | null;
  }