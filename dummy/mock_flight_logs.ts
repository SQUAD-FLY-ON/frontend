import { myFlightLogs } from "@/types/api";

export const mock_flight_logs: myFlightLogs = {
  pageable: {
    unpaged: false,
    pageNumber: 1,
    paged: true,
    pageSize: 10,
    offset: 0,
    sort: {
      unsorted: false,
      sorted: true,
      empty: false,
    },
  },
  numberOfElements: 2,
  size: 10,
  content: [
    {
      id: "f001",
      airfieldName: "서울 한강 비행장",
      airfieldImageUrl: "",
      flightTime: 12.5,
      flightDistance: 8.3,
      averageSpeed: 39.8,
      flightAltitude: 350,
      createdAt: "2025-09-20T10:15:30.000Z",
      track: { points: [
        {
          latitude: 37.527,
          longitude: 127.028,
          altitude: 120.5,
          time: "2025-09-20T10:16:00.000Z",
        },
        {
          latitude: 37.528,
          longitude: 127.03,
          altitude: 135.2,
          time: "2025-09-20T10:18:00.000Z",
        },
      ] },
    },
    {
      id: "f002",
      airfieldName: "강원 평창 활공장",
      airfieldImageUrl: "",
      flightTime: 25.7,
      flightDistance: 15.9,
      averageSpeed: 37.1,
      flightAltitude: 780,
      createdAt: "2025-09-21T08:45:10.000Z",
      track: { points: [
        {
          latitude: 37.37,
          longitude: 128.39,
          altitude: 450.0,
          time: "2025-09-21T08:46:00.000Z",
        },
        {
          latitude: 37.375,
          longitude: 128.395,
          altitude: 620.0,
          time: "2025-09-21T08:50:00.000Z",
        },
      ] },
    },
  ],
  number: 1,
  sort: {
    unsorted: false,
    sorted: true,
    empty: false,
  },
  first: true,
  last: false,
  empty: false,
};
