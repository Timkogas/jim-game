declare namespace Phaser.Loader {
  interface LoaderPlugin extends Phaser.Events.EventEmitter {
      spine(key: string | Phaser.Loader.FileTypes.SpineFileConfig | Phaser.Loader.FileTypes.SpineFileConfig[], jsonURL: string, atlasURL: string | string[], preMultipliedAlpha?: boolean, textureXhrSettings?: Phaser.Types.Loader.XHRSettingsObject, atlasXhrSettings?: Phaser.Types.Loader.XHRSettingsObject): LoaderPlugin;
  }
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
      spine(x: number, y: number, key?: string, animationName?: string, loop?: boolean): SpineGameObject;
      spineContainer(x: number, y: number, children?: SpineGameObject | SpineGameObject[]): SpineContainer;
  }

interface GameObjectCreator {
      spine(config: SpineGameObjectConfig, addToScene?: boolean): SpineGameObject;
      spineContainer(config: SpineContainerConfig, addToScene?: boolean): SpineContainer;
  }
}

declare class SpinePlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager);

  readonly isWebGL: boolean;

  cache: Phaser.Cache.BaseCache;
  spineTextures: Phaser.Cache.BaseCache;
  json: Phaser.Cache.BaseCache;
  textures: Phaser.Textures.TextureManager;
  drawDebug: boolean;
  gl: WebGLRenderingContext;
  renderer: Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer;
  sceneRenderer: spine.webgl.SceneRenderer;
  skeletonRenderer: spine.canvas.SkeletonRenderer | spine.webgl.SkeletonRenderer;
  skeletonDebugRenderer: spine.webgl.SkeletonDebugRenderer;

  plugin: typeof spine;

  getAtlasCanvas(key: string): spine.TextureAtlas;
  getAtlasWebGL(key: string): spine.TextureAtlas;
  worldToLocal(x: number, y: number, skeleton: spine.Skeleton, bone?: spine.Bone): spine.Vector2;
  getVector2(x: number, y: number): spine.Vector2;
  getVector3(x: number, y: number, z: number): spine.Vector2;
  setDebugBones(value?: boolean): SpinePlugin;
  setDebugRegionAttachments(value?: boolean): SpinePlugin;
  setDebugBoundingBoxes(value?: boolean): SpinePlugin;
  setDebugMeshHull(value?: boolean): SpinePlugin;
  setDebugMeshTriangles(value?: boolean): SpinePlugin;
  setDebugPaths(value?: boolean): SpinePlugin;
  setDebugSkeletonXY(value?: boolean): SpinePlugin;
  setDebugClipping(value?: boolean): SpinePlugin;
  setEffect(effect?: spine.VertexEffect): SpinePlugin;
  createSkeleton(key: string, skeletonJSON?: object): any | null;
  createAnimationState(skeleton: spine.Skeleton): any;
  getBounds(skeleton: spine.Skeleton): any;
  onResize(): void;
  add(x: number, y: number, key?: string, animationName?: string, loop?: boolean): SpineGameObject;
  make(config: SpineGameObjectConfig, addToScene?: boolean): SpineGameObject;
}


declare class SpineGameObject extends Phaser.GameObjects.GameObject implements Omit<Phaser.GameObjects.Components.ComputedSize, 'setSize'>, Phaser.GameObjects.Components.Depth, Phaser.GameObjects.Components.Flip, Phaser.GameObjects.Components.ScrollFactor, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible {
  constructor(scene: Phaser.Scene, pluginManager: SpinePlugin, x: number, y: number, key?: string, animationName?: string, loop?: boolean);

  alpha: number;
  angle: number;

  readonly blendMode: number;

  blue: number;
  bounds: any;
  displayOriginX: number;
  displayOriginY: number;
  drawDebug: boolean;
  depth: number;
  displayWidth: number;
  displayHeight: number;
  flipX: boolean;
  flipY: boolean;
  green: number;
  height: number;
  plugin: SpinePlugin;
  preMultipliedAlpha: boolean;
  red: number;
  root: spine.Bone;
  rotation: number;
  scale: number;
  scaleX: number
  scaleY: number
  scrollFactorX: number;
  scrollFactorY: number;
  skeleton: spine.Skeleton;
  skeletonData: spine.SkeletonData;
  // @ts-ignore - spine.AnimationState significantly different than GameObject.state
  state: spine.AnimationState;
  stateData: spine.AnimationStateData;
  timeScale: number;
  visible: boolean;
  x: number;
  y: number;
  z: number;
  w: number;
  width: number;

  addAnimation(trackIndex: number, animationName: string, loop?: boolean, delay?: number): spine.TrackEntry;
  angleBoneToXY(bone: spine.Bone, worldX: number, worldY: number, offset?: number, minAngle?: number, maxAngle?: number): SpineGameObject;
  clearTrack(trackIndex: number): SpineGameObject;
  clearTracks(): SpineGameObject;
  findAnimation(animationName: string): spine.Animation;
  findBone(boneName: string): spine.Bone;
  findBoneIndex(boneName: string): number;
  findEvent(eventDataName: string): spine.EventData;
  findIkConstraint(constraintName: string): spine.IkConstraintData;
  findPathConstraint(constraintName: string): spine.PathConstraintData;
  findPathConstraintIndex(constraintName: string): number;
  findSkin(skinName: string): spine.Skin;
  findSlot(slotName: string): spine.Slot;
  findSlotIndex(slotName: string): number;
  findTransformConstraint(constraintName: string): spine.TransformConstraintData;
  getAnimationList(): string[];
  getAttachment(slotIndex: number, attachmentName: string): spine.Attachment;
  getAttachmentByName(slotName: string, attachmentName: string): spine.Attachment;
  getBoneList(): string[];
  getBounds(): any;
  getCurrentAnimation(trackIndex?: number): spine.Animation;
  getLocalTransformMatrix(tempMatrix?: Phaser.GameObjects.Components.TransformMatrix): Phaser.GameObjects.Components.TransformMatrix;
  getParentRotation(): number;
  getRootBone(): spine.Bone;
  getSkinList(): string[];
  getSlotList(): string[];
  getWorldTransformMatrix(tempMatrix?: Phaser.GameObjects.Components.TransformMatrix, parentMatrix?: Phaser.GameObjects.Components.TransformMatrix): Phaser.GameObjects.Components.TransformMatrix;
  play(animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): SpineGameObject;

  protected preUpdate(time: number, delta: number): void;
  protected preDestroy(): void;

  refresh(): SpineGameObject;
  resetFlip(): this;
  setAlpha(value?: number): SpineGameObject;
  setAngle(degrees?: number): this;
  setAnimation(trackIndex: number, animationName: string, loop?: boolean, ignoreIfPlaying?: boolean): spine.TrackEntry;
  setAttachment(slotName: string, attachmentName: string): SpineGameObject;
  setBonesToSetupPose(): SpineGameObject;
  setColor(color?: number, slotName?: string): SpineGameObject;
  setDepth(value: number): this;
  setDisplaySize(width: number, height: number): this;
  setEmptyAnimation(trackIndex: number, mixDuration?: number): spine.TrackEntry;
  setFlipX(value: boolean): this;
  setFlipY(value: boolean): this;
  setFlip(x: boolean, y: boolean): this;
  setMix(fromName: string, toName: string, duration?: number): SpineGameObject;
  setOffset(offsetX?: number, offsetY?: number): SpineGameObject;
  setPosition(x?: number, y?: number, z?: number, w?: number): this;
  setRandomPosition(x?: number, y?: number, width?: number, height?: number): this;
  setRotation(radians?: number): this;
  setScale(x: number, y?: number): this;
  setScrollFactor(x: number, y?: number): this;
  setSize(width?: number, height?: number, offsetX?: number, offsetY?: number): SpineGameObject;
  setSkeleton(atlasDataKey: string, animationName?: string, loop?: boolean, skeletonJSON?: object): SpineGameObject;
  setSkeletonFromJSON(atlasDataKey: string, skeletonJSON: object, animationName?: string, loop?: boolean): SpineGameObject;
  setSkin(newSkin: spine.Skin): SpineGameObject;
  setSkinByName(skinName: string): SpineGameObject;
  setSlotsToSetupPose(): SpineGameObject;
  setToSetupPose(): SpineGameObject;
  setVisible(value: boolean): this;
  setX(value?: number): this;
  setY(value?: number): this;
  setZ(value?: number): this;
  setW(value?: number): this;
  toggleFlipX(): this;
  toggleFlipY(): this;
  updateSize(): SpineGameObject;
  willRender(): boolean;
}

declare interface SpineGameObjectConfig extends Phaser.Types.GameObjects.GameObjectConfig {
  key?: string;
  animationName?: string;
  loop?: boolean;
  skinName?: string;
  slotName?: string;
  attachmentName?: string;
}
