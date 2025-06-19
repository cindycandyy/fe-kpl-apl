// Enhanced Dependency Injection Container
import { InMemoryEventRepository } from "../repositories/InMemoryEventRepository"
import { InMemoryTicketTypeRepository } from "../repositories/InMemoryTicketTypeRepository"
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository"
import { InMemoryBookingRepository } from "../repositories/InMemoryBookingRepository"
import { InMemorySeatRepository } from "../repositories/InMemorySeatRepository"

import { RegisterUser } from "../../domain/usecases/RegisterUser"
import { LoginUser } from "../../domain/usecases/LoginUser"
import { GetAvailableEvents } from "../../domain/usecases/GetAvailableEvents"
import { BookTicket } from "../../domain/usecases/BookTicket"
import { GetUserBookings } from "../../domain/usecases/GetUserBookings"

import { AuthService } from "../../application/services/AuthService"
import { EventService } from "../../application/services/EventService"
import { BookingService } from "../../application/services/BookingService"

export class Container {
  private static instance: Container
  private services: Map<string, any> = new Map()

  private constructor() {
    this.setupDependencies()
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  private setupDependencies() {
    // Repositories
    const userRepository = new InMemoryUserRepository()
    const eventRepository = new InMemoryEventRepository()
    const ticketTypeRepository = new InMemoryTicketTypeRepository()
    const bookingRepository = new InMemoryBookingRepository()
    const seatRepository = new InMemorySeatRepository()

    // Use Cases
    const registerUser = new RegisterUser(userRepository)
    const loginUser = new LoginUser(userRepository)
    const getAvailableEvents = new GetAvailableEvents(eventRepository)
    const bookTicket = new BookTicket(bookingRepository, eventRepository, ticketTypeRepository, seatRepository)
    const getUserBookings = new GetUserBookings(bookingRepository, eventRepository, ticketTypeRepository)

    // Services
    const authService = new AuthService(registerUser, loginUser)
    const eventService = new EventService(getAvailableEvents, eventRepository, ticketTypeRepository)
    const bookingService = new BookingService(bookTicket, getUserBookings)

    // Register all services
    this.services.set("userRepository", userRepository)
    this.services.set("eventRepository", eventRepository)
    this.services.set("ticketTypeRepository", ticketTypeRepository)
    this.services.set("bookingRepository", bookingRepository)
    this.services.set("seatRepository", seatRepository)

    this.services.set("authService", authService)
    this.services.set("eventService", eventService)
    this.services.set("bookingService", bookingService)

    this.services.set("registerUser", registerUser)
    this.services.set("loginUser", loginUser)
    this.services.set("getAvailableEvents", getAvailableEvents)
    this.services.set("bookTicket", bookTicket)
    this.services.set("getUserBookings", getUserBookings)
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName)
    if (!service) {
      throw new Error(`Service ${serviceName} not found`)
    }
    return service
  }
}
