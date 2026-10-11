import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const SPRITE_URL =
  "https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"

export default function CrowdCanvasBackground({
  className = "fixed inset-0 pointer-events-none z-0 w-full h-full opacity-60",
  rows = 15,
  cols = 7,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const randomRange = (min, max) => min + Math.random() * (max - min)
    const randomIndex = (array) => (randomRange(0, array.length) | 0)
    const removeFromArray = (array, i) => array.splice(i, 1)[0]
    const removeItemFromArray = (array, item) =>
      removeFromArray(array, array.indexOf(item))
    const removeRandomFromArray = (array) =>
      removeFromArray(array, randomIndex(array))
    const getRandomFromArray = (array) => array[randomIndex(array) | 0]

    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1
      const offsetY = 60 - 180 * gsap.parseEase("power2.in")(Math.random())
      const startY = stage.height - peep.height + offsetY
      let startX, endX
      if (direction === 1) {
        startX = -peep.width
        endX = stage.width
        peep.scaleX = 0.85
      } else {
        startX = stage.width + peep.width
        endX = 0
        peep.scaleX = -0.85
      }
      peep.x = startX
      peep.y = startY
      peep.anchorY = startY
      return { startX, startY, endX }
    }

    const normalWalk = ({ peep, props }) => {
      const { startX, startY, endX } = props
      const xDuration = 10
      const yDuration = 0.25
      const tl = gsap.timeline()
      tl.timeScale(randomRange(0.6, 1.4))
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0
      )
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 8,
        },
        0
      )
      return tl
    }

    const walks = [normalWalk]

    const createPeep = ({ image, rect }) => {
      const peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 0.85,
        walk: null,
        setRect: (r) => {
          peep.rect = r
          peep.width = r[2]
          peep.height = r[3]
          peep.drawArgs = [peep.image, ...r, 0, 0, peep.width, peep.height]
        },
        render: (c) => {
          c.save()
          c.translate(peep.x, peep.y)
          c.scale(peep.scaleX, Math.abs(peep.scaleX))
          c.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          )
          c.restore()
        },
      }
      peep.setRect(rect)
      return peep
    }

    const img = document.createElement("img")
    const stage = { width: 0, height: 0 }
    const allPeeps = []
    const availablePeeps = []
    const crowd = []

    const createPeeps = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight
      const total = rows * cols
      const rectWidth = width / rows
      const rectHeight = height / cols
      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        )
      }
    }

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return
      const peep = removeRandomFromArray(availablePeeps)
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep, stage }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep)
        addPeepToCrowd()
      })
      peep.walk = walk
      crowd.push(peep)
      crowd.sort((a, b) => a.anchorY - b.anchorY)
      return peep
    }

    const removePeepFromCrowd = (peep) => {
      removeItemFromArray(crowd, peep)
      availablePeeps.push(peep)
    }

    const initCrowd = () => {
      while (availablePeeps.length) {
        const p = addPeepToCrowd()
        if (p && p.walk) p.walk.progress(Math.random())
      }
    }

    const render = () => {
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
      crowd.forEach((peep) => {
        peep.render(ctx)
      })
      ctx.restore()
    }

    const resize = () => {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      stage.width = canvas.clientWidth || window.innerWidth
      stage.height = canvas.clientHeight || window.innerHeight
      canvas.width = stage.width * dpr
      canvas.height = stage.height * dpr

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill()
      })
      crowd.length = 0
      availablePeeps.length = 0
      availablePeeps.push(...allPeeps)
      initCrowd()
    }

    const init = () => {
      createPeeps()
      resize()
      gsap.ticker.add(render)
    }

    img.crossOrigin = "anonymous"
    img.onload = init
    img.src = SPRITE_URL

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      gsap.ticker.remove(render)
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill()
      })
    }
  }, [rows, cols])

  return <canvas ref={canvasRef} className={className} />
}
