"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Target,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Search,
  UserCheck,
  Bot,
  Brain,
  Zap,
  BarChart3,
  MessageCircle,
  ArrowRight,
  Play,
  Menu,
  X,
  ChevronRight,
  Quote,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import MarieChat from "@/components/marie-chat"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [counters, setCounters] = useState({
    candidates: 0,
    projects: 0,
    commitment: 0,
    experience: 0,
  })

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy Marie, tu asistente virtual de Gear360hr. ¿En qué puedo ayudarte hoy?",
      sender: "marie",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Función para enviar mensaje a Marie
  const sendMessageToMarie = async (message: string) => {
    setIsLoading(true)

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user" as const,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    try {
      const response = await fetch("https://isagis.app.n8n.cloud/webhook/c9b4472d-b7a4-439d-a2b2-fa88ece909d2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          sessionId: `session_${Date.now()}`, // Generar ID de sesión único
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Agregar respuesta de Marie
        const marieResponse = {
          id: Date.now() + 1,
          text: data.response || data.message || "Lo siento, no pude procesar tu mensaje. ¿Podrías intentar de nuevo?",
          sender: "marie" as const,
          timestamp: new Date(),
        }

        setChatMessages((prev) => [...prev, marieResponse])
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error al enviar mensaje a Marie:", error)

      // Mensaje de error de Marie
      const errorMessage = {
        id: Date.now() + 1,
        text: "Disculpa, estoy teniendo problemas técnicos en este momento. Por favor, intenta contactarnos directamente al 350-5795394.",
        sender: "marie" as const,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() && !isLoading) {
      sendMessageToMarie(inputMessage.trim())
    }
  }

  // Counter animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCounters((prev) => ({
          candidates: Math.min(prev.candidates + 3, 99),
          projects: Math.min(prev.projects + 1, 15),
          commitment: Math.min(prev.commitment + 4, 100),
          experience: Math.min(prev.experience + 1, 5),
        }))
      }, 50)

      setTimeout(() => clearInterval(interval), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Carlos Mendoza",
      company: "Ecopetrol",
      text: "Gear360hr transformó nuestro proceso de selección. Marie nos ayudó a reducir el tiempo de contratación en un 70%.",
      avatar: "/placeholder.svg?height=80&width=80&text=CM",
    },
    {
      name: "Ana Rodríguez",
      company: "Pacific Rubiales",
      text: "La precisión en el matching de perfiles es impresionante. Encontraron exactamente el talento que necesitábamos.",
      avatar: "/placeholder.svg?height=80&width=80&text=AR",
    },
    {
      name: "Miguel Torres",
      company: "Canacol Energy",
      text: "El proceso con IA de Gear360hr es revolucionario. Nos permitió identificar candidatos que jamás habríamos considerado.",
      avatar: "/placeholder.svg?height=80&width=80&text=MT",
    },
  ]

  const services = [
    {
      title: "Atracción y Selección Estratégica",
      description: "Head hunting especializado con metodología probada",
      icon: <Search className="h-8 w-8" />,
      features: [
        "Mapeo estratégico del mercado",
        "Assessment center avanzado",
        "Evaluación 360° integral",
        "Verificación exhaustiva de referencias",
      ],
      color: "from-gear-purple to-gear-purple-light",
    },
    {
      title: "Consultoría Organizacional",
      description: "Transformación y desarrollo organizacional",
      icon: <Users className="h-8 w-8" />,
      features: [
        "Auditorías SGC especializadas",
        "Gestión del cambio organizacional",
        "Desarrollo de liderazgo",
        "Cultura y clima organizacional",
      ],
      color: "from-gear-purple-light to-gear-pink",
    },
    {
      title: "Servicios de IA Aplicada",
      description: "Inteligencia artificial para recursos humanos",
      icon: <Brain className="h-8 w-8" />,
      features: [
        "Pruebas automáticas con IA",
        "Matching algorítmico de perfiles",
        "Detección automática de sesgos",
        "Reportes dinámicos inteligentes",
        "Seguimiento predictivo post-ingreso",
        "Asistente virtual 24/7 (Marie)",
      ],
      color: "from-gear-pink to-gear-purple",
      isHighlighted: true,
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "Diagnóstico",
      description: "Análisis profundo de necesidades y cultura organizacional",
      icon: <Search className="h-6 w-6" />,
    },
    {
      step: "02",
      title: "Búsqueda",
      description: "Mapeo estratégico del mercado y sourcing especializado",
      icon: <Target className="h-6 w-6" />,
    },
    {
      step: "03",
      title: "Evaluación Técnica + Psicotécnica + IA",
      description: "Assessment integral potenciado con inteligencia artificial",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      step: "04",
      title: "Selección y Onboarding",
      description: "Proceso de selección final y acompañamiento en integración",
      icon: <UserCheck className="h-6 w-6" />,
    },
    {
      step: "05",
      title: "Seguimiento + Feedback",
      description: "Monitoreo continuo y retroalimentación con IA predictiva",
      icon: <BarChart3 className="h-6 w-6" />,
    },
  ]

  const teamMembers = [
    {
      name: "Jennifer Torres Rojas",
      role: "Consultora Senior de Talento Humano",
      bio: "Psicóloga especialista en Gerencia de RRHH, consultora en marca personal con experiencia en desarrollo de líderes y equipos.",
      specialty: "Cultura Organizacional",
      initials: "JT",
      contact: "350-5795394 / 316-2654366",
    },
    {
      name: "Jeimy Balaguera R.",
      role: "Gerente Consultoría Estratégica",
      bio: "Psicóloga especialista en gerencia de talento humano con más de 17 años de experiencia en cargos de dirección y consultoría integral.",
      specialty: "Compliance Corporativo",
      initials: "JB",
    },
    {
      name: "Andrés Neira M.",
      role: "Consultor Senior Gestión Organizacional",
      bio: "Ingeniero industrial especializado en producción, logística y seguridad, experto en gestión de calidad y reorganización de procesos.",
      specialty: "Procesos Empresariales",
      initials: "AN",
    },
    {
      name: "Esperanza Forero",
      role: "Líder Estudios de Seguridad",
      bio: "Trabajadora Social con más de 25 años de experiencia en seguridad documental y domiciliaria, especialista en comunidades vulnerables.",
      specialty: "Seguridad Documental",
      initials: "EF",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo-gear360hr.jpg"
                alt="Gear360Hr Logo"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link href="#inicio" className="text-gear-black hover:text-gear-purple font-medium transition-colors">
                Inicio
              </Link>
              <Link href="#servicios" className="text-gear-black hover:text-gear-purple font-medium transition-colors">
                Servicios
              </Link>
              <Link href="#proceso" className="text-gear-black hover:text-gear-purple font-medium transition-colors">
                Proceso
              </Link>
              <Link href="#equipo" className="text-gear-black hover:text-gear-purple font-medium transition-colors">
                Equipo
              </Link>
              <Link href="#ia" className="text-gear-black hover:text-gear-purple font-medium transition-colors">
                IA
              </Link>
              <Link href="#contacto" className="text-gear-black hover:text-gear-purple font-medium transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  href="#inicio"
                  className="text-gear-black hover:text-gear-purple font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="#servicios"
                  className="text-gear-black hover:text-gear-purple font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Servicios
                </Link>
                <Link
                  href="#proceso"
                  className="text-gear-black hover:text-gear-purple font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Proceso
                </Link>
                <Link
                  href="#equipo"
                  className="text-gear-black hover:text-gear-purple font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Equipo
                </Link>
                <Link
                  href="#ia"
                  className="text-gear-black hover:text-gear-purple font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  IA
                </Link>
                <Link
                  href="#contacto"
                  className="text-gear-black hover:text-gear-purple font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
                <Button
                  size="md"
                  className="bg-gear-pink hover:bg-gear-pink/90 text-white font-semibold rounded-full px-6 w-fit"
                  onClick={() => {
                    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                    setIsMenuOpen(false)
                  }}
                >
                  Contáctanos
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/banner-background.png"
            alt="Gear360hr Corporate Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
            {/* Left Column - Marie and Buttons */}
            <div className="text-white flex flex-col items-center lg:items-start">
              <div className="flex flex-col items-center lg:items-start p-8 w-full">
                {/* Título Principal */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 text-center lg:text-left leading-tight">
                  Conectamos talento con <span className="text-white">propósito</span>
                </h1>

                {/* Subtítulo */}
                <p className="text-lg md:text-xl text-white/90 mb-8 text-center lg:text-left max-w-2xl leading-relaxed">
                  Impulsamos tu equipo con procesos inteligentes potenciados por{" "}
                  <span className="text-gear-pink font-semibold">Inteligencia Artificial</span>
                </p>

                {/* Contenedor Marie Centrado */}
                <div className="flex flex-col items-center gap-6 w-full">
                  {/* Marie Avatar */}
                  <Image
                    src="/images/marie-avatar.png"
                    alt="Marie - Asistente Virtual de Gear360hr"
                    width={100}
                    height={100}
                    className="w-25 h-25 object-cover animate-float"
                    priority
                  />

                  {/* Botón Marie */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-gear-purple bg-transparent font-semibold px-6 py-3 rounded-full text-base transition-all duration-300"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Habla con Marie, nuestra IA
                  </Button>

                  {/* Marie Description - Una sola línea */}
                  <div className="text-center text-white w-full">
                    <p className="text-sm text-white/80 mb-2 w-full">
                      Conoce a Marie, nuestra asistente virtual especializada en gestión de talento humano • Disponible
                      24/7 para ayudarte
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>En línea ahora</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Video Frame */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                {/* Video Frame Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/20">
                  <div className="text-center text-white relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                      <Play className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Video de Bienvenida</h3>
                    <p className="text-white/80 text-sm">Próximamente disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gear-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gear-black mb-4">
              Nuestros <span className="gradient-text">Servicios</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluciones integrales de gestión humana potenciadas por inteligencia artificial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white relative overflow-hidden ${
                  service.isHighlighted ? "ring-2 ring-gear-pink" : ""
                }`}
              >
                {service.isHighlighted && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gear-pink text-white font-semibold">NUEVO</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}
                  >
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gear-black mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full mt-6 border-gear-purple text-gear-purple hover:bg-gear-purple hover:text-white transition-all duration-300 bg-transparent"
                  >
                    Saber más
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Timeline */}
      <section id="proceso" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gear-black mb-4">
              Nuestro <span className="gradient-text">Proceso</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Metodología probada con tecnología de vanguardia</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-gear rounded-full hidden md:block"></div>

            <div className="space-y-8 md:space-y-12">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div
                    className={`flex items-center ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"} w-full`}
                  >
                    <div
                      className={`w-full md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                      }`}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border-2 border-transparent hover:border-gear-pink">
                        <CardContent className="p-6">
                          <div
                            className={`flex items-center gap-4 ${
                              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                            }`}
                          >
                            <div className="w-16 h-16 bg-gradient-gear rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                              {step.icon}
                            </div>
                            <div className={index % 2 === 0 ? "md:text-right" : "md:text-left"}>
                              <div className="text-sm font-bold text-gear-pink mb-1">{step.step}</div>
                              <h3 className="text-xl font-bold text-gear-black mb-2">{step.title}</h3>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gear-pink rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marie AI Section */}
      <section id="ia" className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <Bot className="h-5 w-5 text-gear-pink" />
                <span className="text-sm font-semibold">Inteligencia Artificial</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Conoce a <span className="text-gear-pink">Marie</span>
              </h2>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <Quote className="h-8 w-8 text-gear-pink mb-4" />
                <p className="text-xl leading-relaxed">
                  "Hola, soy <strong className="text-gear-pink">Marie</strong>, la inteligencia artificial de Gear360hr.
                  Estoy aquí para ayudarte a encontrar el talento ideal, automatizar procesos y mejorar la experiencia
                  de tus colaboradores."
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gear-pink rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Automatización Inteligente</h3>
                    <p className="text-white/80">Procesos 70% más rápidos con IA</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gear-pink rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Análisis Predictivo</h3>
                    <p className="text-white/80">Predicción de éxito y compatibilidad cultural</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gear-pink rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Disponible 24/7</h3>
                    <p className="text-white/80">Asistencia continua para candidatos y clientes</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-8 bg-white text-gear-purple hover:bg-white/90 font-semibold px-8 py-4 rounded-full text-lg"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chatear con Marie
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                {/* Marie Avatar */}
                <div className="w-64 h-64 mx-auto mb-6 relative">
                  <div className="w-full h-full bg-gradient-to-br from-gear-pink to-gear-purple rounded-full flex items-center justify-center relative overflow-hidden animate-float">
                    <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="h-24 w-24 text-white" />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Marie está en línea</h3>
                  <p className="text-white/80 mb-6">Asistente virtual especializada en gestión de talento humano</p>

                  {/* Chat Demo */}
                  <div className="bg-white/20 rounded-2xl p-4 text-left space-y-3">
                    <div className="bg-gear-pink/30 rounded-lg p-3">
                      <p className="text-sm">👋 ¡Hola! ¿En qué puedo ayudarte hoy?</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 ml-8">
                      <p className="text-sm">Necesito encontrar un ingeniero de petróleo senior</p>
                    </div>
                    <div className="bg-gear-pink/30 rounded-lg p-3">
                      <p className="text-sm">
                        🎯 Perfecto. He encontrado 15 candidatos que coinciden con tu perfil. ¿Te gustaría ver el
                        análisis de compatibilidad?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-20 bg-gear-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gear-black mb-4">
              Nuestro <span className="gradient-text">Equipo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales expertos respaldados por tecnología de vanguardia
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0"
              >
                <CardHeader className="text-center">
                  <div className="w-32 h-32 bg-gradient-gear rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <CardTitle className="text-xl font-bold text-gear-black">{member.name}</CardTitle>
                  <CardDescription className="text-gear-purple font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                  <Badge className="bg-gear-purple/10 text-gear-purple mb-2">{member.specialty}</Badge>
                  {member.contact && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">📞 {member.contact}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Marie Card - Special */}
          <div className="max-w-md mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-gear-pink/5 to-gear-purple/5 border-2 border-gear-pink/20">
              <CardHeader className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gear-pink to-gear-purple rounded-full mx-auto mb-4 flex items-center justify-center text-white relative group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-16 w-16" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gear-black">Marie</CardTitle>
                <CardDescription className="text-gear-pink font-semibold">
                  Asistente Virtual de Talento Humano
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  Asistente virtual impulsada por IA especializada en gestión de talento humano, automatización de
                  procesos y análisis predictivo.
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Badge className="bg-gear-pink text-white">IA Avanzada</Badge>
                  <Badge className="bg-gear-purple text-white">24/7 Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results & Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Animated Counters */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl font-extrabold gradient-text mb-2">+{counters.candidates}</div>
              <div className="text-gray-600 font-medium">Candidatos evaluados</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold gradient-text mb-2">+{counters.projects}</div>
              <div className="text-gray-600 font-medium">Proyectos completados</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold gradient-text mb-2">{counters.commitment}%</div>
              <div className="text-gray-600 font-medium">Compromiso con resultados</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold gradient-text mb-2">+{counters.experience}</div>
              <div className="text-gray-600 font-medium">Años de experiencia</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center text-gear-black mb-12">
              Lo que dicen nuestros <span className="gradient-text">clientes</span>
            </h2>

            <div className="bg-gear-gray rounded-3xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 overflow-hidden">
                  <Image
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Quote className="h-8 w-8 text-gear-pink mx-auto mb-4" />
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="font-bold text-gear-black">{testimonials[currentTestimonial].name}</div>
                <div className="text-gear-purple font-medium">{testimonials[currentTestimonial].company}</div>
              </div>

              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? "bg-gear-pink" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                ¿Listo para <span className="text-gear-pink">transformar</span> tu equipo?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Contáctanos hoy y descubre cómo podemos potenciar tu organización con IA y expertise humano.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gear-pink rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">Jennifer Torres Rojas</div>
                    <div className="text-white/80">350-5795394 / 316-2654366</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gear-pink rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">Email</div>
                    <div className="text-white/80">contacto@gear360hr.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gear-pink rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">Ubicación</div>
                    <div className="text-white/80">Bogotá, Colombia</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Solicita una consulta gratuita</h3>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nombre completo"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl"
                  />
                  <Input
                    placeholder="Empresa"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl"
                  />
                </div>

                <Input
                  type="email"
                  placeholder="Email corporativo"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl"
                />

                <Textarea
                  placeholder="¿Qué necesitas? Cuéntanos sobre tu desafío de talento..."
                  rows={4}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl"
                />

                <Button
                  size="lg"
                  className="w-full bg-gear-pink hover:bg-gear-pink/90 text-white font-semibold py-4 rounded-xl text-lg"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Enviar solicitud
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/70 text-sm mb-4">O chatea directamente con Marie</p>
                <Button
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white hover:text-gear-purple bg-transparent rounded-xl"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chatear con IA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gear-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-gear-purple">Gear</span>
                  <span className="text-gear-pink">360</span>
                  <span className="text-gear-purple">hr</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Potenciamos el talento, transformamos organizaciones</p>
              <p className="text-gray-400 text-sm">Especialistas en Oil & Gas con tecnología de vanguardia</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gear-pink">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Head Hunting Estratégico</li>
                <li>Consultoría Organizacional</li>
                <li>Servicios de IA Aplicada</li>
                <li>Estudios de Seguridad</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gear-pink">Industrias</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Oil & Gas</li>
                <li>Energía</li>
                <li>Manufactura</li>
                <li>Tecnología</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gear-pink">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 350-5795394</li>
                <li>📞 316-2654366</li>
                <li>✉️ contacto@gear360hr.com</li>
                <li>📍 Bogotá, Colombia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Gear360Hr. Todos los derechos reservados.
            </p>
            <p className="text-gear-pink text-sm font-medium mt-2">
              "Potenciamos el talento, transformamos organizaciones"
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget de Marie */}
      <MarieChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
