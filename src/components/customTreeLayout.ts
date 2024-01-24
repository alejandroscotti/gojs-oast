import * as go from "gojs"

export class CustomTreeLayout extends go.Layout {
  private _mainLayout: go.TreeLayout
  private _sideLayout: go.Layout
  private _side: go.Spot
  private _spacing: go.Size

  constructor() {
    super()
    const mainLayout = new go.TreeLayout({
      layerSpacing: 10,
      angle: 90,
    })
    this._mainLayout = mainLayout
    const sideLayout = new go.TreeLayout({
      layerSpacing: 10,
      angle: 90,
    })
    //const sideLayout = new go.Layout()
    this._sideLayout = sideLayout
    console.log("CustomTreeLayout constructor")
    this._side = go.Spot.LeftSide
    this._spacing = new go.Size(250, 200)
  }

  /**
   * Gets or sets the side {@link Spot} where the side nodes and links should be laid out,
   * relative to the results of the main Layout.
   * The default value is Spot.BottomSide.
   *
   * If the value is Spot.Bottom, Spot.Top, Spot.Right, or Spot.Left,
   * the side nodes will be centered along that side.
   *
   * Currently only handles a single side.
   * @name ArrangingLayout#side
   * @return {Spot}
   */
  get side(): go.Spot {
    return this._side
  }
  set side(val: go.Spot) {
    if (
      !(val instanceof go.Spot) ||
      !(
        val.isSide() ||
        val.equals(go.Spot.Top) ||
        val.equals(go.Spot.Right) ||
        val.equals(go.Spot.Bottom) ||
        val.equals(go.Spot.Left)
      )
    ) {
      throw new Error(
        "new value for ArrangingLayout.side must be a side or middle-side Spot, not: " +
          val
      )
    }
    if (!this._side.equals(val)) {
      this._side = val.copy()
      this.invalidateLayout()
    }
  }

  override doLayout(coll: go.Diagram | go.Group | go.Iterable<go.Part>) {
    // Select nodes for the main layout
    const coll2 = this.collectParts(coll)

    if (coll2.count === 0) return

    let diagram = this.diagram
    if (diagram === null) diagram = coll2.first()!.diagram
    if (diagram === null) return

    const mainColl = new go.Set<go.Part>()
    const sideColl = new go.Set<go.Part>()
    this.splitAndArrangeParts(coll2, mainColl, sideColl)

    // Run main layout
    diagram.startTransaction("Arranging Main Layout")
    this._mainLayout.doLayout(mainColl)
    diagram.commitTransaction("Arranging Main Layout")

    // Run Side layout
    diagram.startTransaction("Arranging Side Layout")
    this._sideLayout.doLayout(sideColl)
    diagram.commitTransaction("Arranging Side Layout")

    this.moveSideCollection(sideColl)
  }

  /**
   * Gets or sets the space between the main layout and the side layout.
   * The default value is Size(20, 20).
   * @name ArrangingLayout#spacing
   * @return {Size}
   */
  get spacing(): go.Size {
    return this._spacing
  }
  set spacing(val: go.Size) {
    if (!(val instanceof go.Size))
      throw new Error(
        "new value for ArrangingLayout.spacing must be a Size, not: " + val
      )
    if (!this._spacing.equals(val)) {
      this._spacing = val.copy()
      this.invalidateLayout()
    }
  }

  /**
   * This method is called just after the sideLayout has been performed in order to move
   * its parts to the desired area relative to the results of the main layouts.
   * By default this calls {@link Diagram#moveParts} on the sidecoll collection to the {@link #side} of the mainbounds.
   * This won't get called if there are no Parts in the sidecoll collection.
   * @param {Set} sidecoll a collection of Parts that were laid out by the sideLayout
   * @param {Rect} mainbounds the area occupied by the results of the main layouts
   * @param {Rect} sidebounds the area occupied by the results of the sideLayout
   */
  moveSideCollection(sidecoll: go.Set<go.Part>) {
    const mainbounds = new go.Rect(500, 0, 500, 500)
    const sidebounds = new go.Rect(0, 0, 500, 500)
    const diagram = this.diagram
    if (!diagram) return
    let pos: go.Point | null = null
    if (this.side.equals(go.Spot.Bottom)) {
      pos = new go.Point(
        mainbounds.centerX - sidebounds.width / 2,
        mainbounds.y + mainbounds.height + this.spacing.height
      )
    } else if (this.side.equals(go.Spot.Right)) {
      pos = new go.Point(
        mainbounds.x + mainbounds.width + this.spacing.width,
        mainbounds.centerY - sidebounds.height / 2
      )
    } else if (this.side.equals(go.Spot.Top)) {
      pos = new go.Point(
        mainbounds.centerX - sidebounds.width / 2,
        mainbounds.y - sidebounds.height - this.spacing.height
      )
    } else if (this.side.equals(go.Spot.Left)) {
      pos = new go.Point(
        mainbounds.x - sidebounds.width - this.spacing.width,
        mainbounds.centerY - sidebounds.height / 2
      )
    } else if (this.side.includesSide(go.Spot.BottomSide)) {
      pos = new go.Point(
        mainbounds.x,
        mainbounds.y + mainbounds.height + this.spacing.height
      )
    } else if (this.side.includesSide(go.Spot.RightSide)) {
      pos = new go.Point(
        mainbounds.x + mainbounds.width + this.spacing.width,
        mainbounds.y
      )
    } else if (this.side.includesSide(go.Spot.TopSide)) {
      pos = new go.Point(
        mainbounds.x,
        mainbounds.y - sidebounds.height - this.spacing.height
      )
    } else if (this.side.includesSide(go.Spot.LeftSide)) {
      pos = new go.Point(
        mainbounds.x - sidebounds.width - this.spacing.width,
        mainbounds.y
      )
    }
    if (pos !== null) {
      diagram.moveParts(sidecoll, pos.subtract(sidebounds.position))
    }
  }

  private splitAndArrangeParts = (
    coll: go.Set<go.Part>,
    mainColl: go.Set<go.Part>,
    sideColl: go.Set<go.Part>
  ) => {
    let unorderedSideCollArray: { part: go.Part; idx: number }[] = []
    const spacerArray: { part: go.Part; idx: number }[] = []
    const unorderedMainCollArray: { part: go.Part; idx: number }[] = []
    const mainCollArray: go.Part[] = []
    let idx = -1
    coll.each((part) => {
      switch (part.data.category) {
        case "ImportNode":
          idx++
          unorderedSideCollArray.push({ part: part, idx: 99 })
          break
        case "SpacerNode":
          idx++
          spacerArray.push({ part: part, idx: idx })
          break
        default:
          unorderedMainCollArray.push({ part: part, idx: 0 })
      }
    })
    // Arrange MainCollArray by links between nodes down the tree
    // Start at prepend node
    const prepend = unorderedMainCollArray.find((part) => {
      return part.part.data.key === "prepend"
    })
    if (!prepend) throw new Error("No prepend node found")
    // recursively walk the links
    this.walkLinks(prepend.part, unorderedMainCollArray, mainCollArray)

    mainCollArray.forEach((part) => {
      console.log(
        "mainCollArray: ",
        part.data.title ? part.data.title : part.data.key
      )
    })

    // Add spacers if the side tree is smaller than the main tree (minus the append node)
    if (
      unorderedSideCollArray.length + spacerArray.length <
      mainCollArray.length - 1
    ) {
      const spacerCount =
        mainCollArray.length +
        unorderedSideCollArray.length -
        spacerArray.length
      for (let i = 0; i < spacerCount; i++) {
        const spacer = spacerArray[0].part.copy()
        spacer.data.key = spacer.data.key + i
        unorderedSideCollArray.push({ part: spacer, idx: 100 })
        idx++
      }
    }
    // Reorder sideCollArray to match links into mainColl
    // Find links in sideCollArray
    unorderedSideCollArray.forEach((part) => {
      const node = part.part as go.Node
      if (node) {
        node.findLinksConnected().each((link: any) => {
          // Find position of link.to in mainCollArray
          const index = mainCollArray.findIndex((part) => {
            return part.data.key === link.data.to
          })
          console.log(`Link data:  ${link.data.to} is at index ${index}`)
          if (index < part.idx) {
            // Insert part at index
            part.idx = index
          } else if (part.idx === 99) {
            part.idx = index
          }
        })
      }
    })

    // order side coll based on allocated and unallocated idx
    const unallocatedParts = unorderedSideCollArray
      .filter((part) => {
        return part.idx === 99 || part.idx === 100
      })
      .sort((a, b) => {
        return a.idx - b.idx
      })
    const allocatedParts = unorderedSideCollArray
      .filter((part) => part.idx !== 99)
      .sort((a, b) => {
        return a.idx - b.idx
      })

    //sort unorderedSideCollArray by idx
    sideColl.add(spacerArray[0].part)
    for (let l = 1; l <= unorderedSideCollArray.length; l++) {
      const allocated = allocatedParts.find((part) => part.idx === l)
      if (allocated) {
        sideColl.add(allocated.part)
      } else {
        sideColl.add(unallocatedParts[0].part)
        unallocatedParts.shift()
      }
    }
    mainCollArray.forEach((part) => {
      mainColl.add(part)
    })
  }

  private walkLinks = (
    part: go.Part,
    unorderedMainCollArray: { part: go.Part; idx: number }[] = [],
    mainCollArray: go.Part[]
  ) => {
    const node = part as go.Node
    mainCollArray.push(part)
    if (node) {
      node.findLinksOutOf().each((link: any) => {
        // Find position of link.to in mainCollArray
        const index = unorderedMainCollArray.findIndex((part) => {
          return part.part.data.key === link.data.to
        })

        this.walkLinks(
          unorderedMainCollArray[index].part,
          unorderedMainCollArray,
          mainCollArray
        )
      })
    }
  }
}
