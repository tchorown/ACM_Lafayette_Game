using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Xml;
using System.IO;

[ExecuteInEditMode]
public class TiledTilemaps : MonoBehaviour
{	
	public bool reloadAndCommit = false;
	
	private GameObject meshObject;
	private Camera mainCamera;
	
	private MeshFilter meshFilter;
	private MeshCollider meshCollider;
	private MeshRenderer meshRenderer;
	private Mesh mesh;
	
	public float BleedingOffset = 0.0065f;
	
	public float _cameraOrthoSize = 5f;
	public float CameraOrthoSize {
		set {
			_cameraOrthoSize = value;
			reloadAndCommit = true;
			Update();
		}
	}
	
	public float _targetSize = 640f;
	public float TargetSize {
		set {
			_targetSize = value;
			reloadAndCommit = true;
			Update();
		}
	}	
	
	public float _layerZ = -0.1f;
	public float LayerZ {
		set {
			_layerZ = value;
			reloadAndCommit = true;
			Update();
		}
	}
	
	public bool _generateMeshCollider = true;
	public bool GenerateMeshCollider {
		set {
			_generateMeshCollider = value;
			reloadAndCommit = true;
			Update();
		}
	}
	
	private float scale;
	private float scaleX;
	private float scaleY;
	private float anchorX; 
	private float anchorY;
	
	private struct TilelayerData {
		public string name;
		public int[,] gids;
	}
	
	private struct TilesetData {
		public string name;
		public int firstgid;
		public int tilewidth;
		public int tileheight;
		public int spacing;
		public int margin;
		public string imagesource;
		public float imagewidth;
		public float imageheight;		
		public int tilesPerRow;
		public int tilesPerColumn;
		public int amountTiles;
	}
	
	private int tilemapWidth;
	private int tilemapHeight;
	private float tileWidth;
	private float tileHeight;	
	private List<TilesetData> tilesets;
	private List<TilelayerData> layers;
	private Dictionary<int, int> tilesetIdToGid;
	
	public TextAsset _tiledXMLFile = null;		
    public TextAsset tiledXMLFile
    {
        get {
            return _tiledXMLFile;
        }
        set {
            _tiledXMLFile = value;	
            Update();
        }
	}
	
	private int _amountTilesets = 0;
	public Texture[] TilesetsTextures;	
	public Material[] TilesetsMaterials;

    private XmlDocument _xml;
	
    private bool LoadTiledXML()
    {
        try {
            _xml.LoadXml(_tiledXMLFile.text);
            return true;
        }
        catch (System.Exception err) {
            Debug.LogError("Tiled Importer: An error ocurred when trying to load the Tiled XML file.");
			Debug.LogError(err.Message);
			
        }
		
        return false;
    }
	
	void Awake()
	{
		if(meshObject == null)
		{
			meshObject = gameObject;
			_xml = new XmlDocument();			
			mainCamera = Camera.mainCamera;
		}
	}
	
    void Start()
    {
    }

    void ImportTiledXML()
    {		
        if(LoadTiledXML())
		{		
			if(_xml.DocumentElement.Name == "map")
			{
				tilemapWidth = System.Convert.ToInt32(_xml.DocumentElement.Attributes["width"].Value);
				tilemapHeight = System.Convert.ToInt32(_xml.DocumentElement.Attributes["height"].Value);
				tileWidth = System.Convert.ToInt32(_xml.DocumentElement.Attributes["tilewidth"].Value);
				tileHeight = System.Convert.ToInt32(_xml.DocumentElement.Attributes["tileheight"].Value);	
				
				scaleX = tileWidth * scale;
				scaleY = tileHeight * scale;
				
				anchorX = 0; 
				anchorY = tileHeight;
				
				XmlNodeList tilesetsNodes = _xml.DocumentElement.SelectNodes("tileset");
				XmlNodeList layersNodes = _xml.DocumentElement.SelectNodes("layer");
				
				XmlNode subNode = null;
				XmlNode subSubNode = null;
				
				tilesets = new List<TilesetData>();
				layers = new List<TilelayerData>();
				tilesetIdToGid = new Dictionary<int, int>();
				
				for(int tilesetId = 0; tilesetId < tilesetsNodes.Count; ++tilesetId)
				{
					subNode = tilesetsNodes[tilesetId];
					
					TilesetData tileset = new TilesetData();
					tileset.name = subNode.Attributes["name"].Value;
					tileset.firstgid = System.Convert.ToInt32(subNode.Attributes["firstgid"].Value);
					tileset.tilewidth = System.Convert.ToInt32(subNode.Attributes["tilewidth"].Value);
					tileset.tileheight = System.Convert.ToInt32(subNode.Attributes["tileheight"].Value);
					
					if(subNode.Attributes["margin"] != null)
						tileset.margin = System.Convert.ToInt32(subNode.Attributes["margin"].Value);
					else
						tileset.margin = 0;
					
					if(subNode.Attributes["spacing"] != null)
						tileset.spacing = System.Convert.ToInt32(subNode.Attributes["spacing"].Value);
					else
						tileset.spacing = 0;
	
					subSubNode = subNode.SelectSingleNode("image");
					tileset.imagesource = subSubNode.Attributes["source"].Value;
					tileset.imagewidth = (float)System.Convert.ToDouble(subSubNode.Attributes["width"].Value);
					tileset.imageheight = (float)System.Convert.ToDouble(subSubNode.Attributes["height"].Value);				
	
					tileset.tilesPerRow = (int)((tileset.imagewidth - tileset.margin * 2 + tileset.spacing) / 
												(tileset.tilewidth + tileset.spacing)
											   );
					
					tileset.tilesPerColumn = (int)((tileset.imageheight - tileset.margin * 2 + tileset.spacing) / 
												(tileset.tileheight + tileset.spacing)
											   );
					
					tileset.amountTiles = tileset.tilesPerRow * tileset.tilesPerColumn;
						
					tilesets.Add(tileset);
					
					// Map each gid of this tileset with the Tileset ID, so when building the tilemap
					// mesh, we can easily grab the tileset related to the gid.
					for (int gid = tileset.firstgid; gid <= (tileset.firstgid + tileset.amountTiles - 1); gid++) {
						tilesetIdToGid.Add(gid, tilesetId);
					}
				}
				
				for(int layerId = 0; layerId < layersNodes.Count; ++layerId)
				{
					subNode = layersNodes[layerId];
					
					TilelayerData layer = new TilelayerData();
					layer.name = subNode.Attributes["name"].Value;
					
					XmlNodeList gidsNodes = subNode.SelectNodes("data/tile");				
	
					int gidRow = 0;
					int gidColumn = 0;
					
					layer.gids = new int[tilemapWidth, tilemapHeight];
					
					for (int gi = 0; gi < gidsNodes.Count; gi++)
					{	
						layer.gids[gidRow,gidColumn] = System.Convert.ToInt32(gidsNodes[gi].Attributes["gid"].Value);
						gidColumn++;
						
						if((gi+1) % tilemapWidth == 0)
						{
							gidRow++;	
							gidColumn = 0;
						}					
					}
					
					layers.Add(layer);
				}
				
				_amountTilesets = tilesets.Count;
				
				if(TilesetsTextures != null && TilesetsTextures.Length != _amountTilesets) {
					for (int i = 0; i < TilesetsMaterials.Length; i++) {
						if(TilesetsMaterials[i] != null) {
							DestroyImmediate(TilesetsMaterials[i]);
						}
					}
					
					TilesetsTextures = null;
					TilesetsMaterials = null;	
				}
				
				if(TilesetsTextures == null) {
					TilesetsTextures = new Texture[_amountTilesets];
					TilesetsMaterials = new Material[TilesetsTextures.Length];
				}					
			}
		}
    }

    void Update()
    {   
		if(reloadAndCommit)
		{		
			if(_xml == null) _xml = new XmlDocument();
			
			if(mainCamera.isOrthoGraphic)
				_cameraOrthoSize = mainCamera.orthographicSize;
			
			scale = 2.0f * _cameraOrthoSize / _targetSize;
			
            if (_tiledXMLFile != null) {
                ImportTiledXML();
            }
		
			// If a new texture is assigned, create and assign a material
			if(tilesets != null && TilesetsTextures.Length == tilesets.Count)
			{	
				bool generate = true;
				
				for (int i = 0; i < TilesetsTextures.Length; i++)
				{
					if(TilesetsTextures[i] == null) {
						generate = false;
						break;
					}
					
					if(TilesetsMaterials[i] != null) {
						DestroyImmediate(TilesetsMaterials[i]);
						TilesetsMaterials[i] = null;
					}
					
					TilesetsMaterials[i] = new Material(Shader.Find("Unlit/Transparent Cutout"));
					TilesetsMaterials[i].name = "Tileset " + tilesets[i].name;
					TilesetsMaterials[i].mainTexture = TilesetsTextures[i] as Texture2D;
				}
				
				if(generate) GenerateTilemap();
			}
			
			if (reloadAndCommit) reloadAndCommit = false;
        }		
    }
	
	void GenerateTilemap()
	{		
		if(meshObject.GetComponent<MeshFilter>() != null) {
			DestroyImmediate(meshObject.GetComponent<MeshFilter>());
			mesh = null;
		}
		
		meshFilter = meshObject.AddComponent<MeshFilter>();		
		mesh = new Mesh();
		
		if(meshObject.GetComponent<MeshCollider>() == null) {
			if(_generateMeshCollider)
				meshCollider = meshObject.AddComponent<MeshCollider>();
		} else if(!_generateMeshCollider) {
			DestroyImmediate(meshObject.GetComponent<MeshCollider>());
			meshCollider = null;
		} else if (_generateMeshCollider) {
			meshCollider = meshObject.GetComponent<MeshCollider>();
		}
		
		if(meshObject.GetComponent<MeshRenderer>() == null) {
			meshRenderer = meshObject.AddComponent<MeshRenderer>();	
		} else {
			meshRenderer = meshObject.GetComponent<MeshRenderer>();	
		}
		
		List<Vector3> vertices = new List<Vector3>();
		List<Vector2> uvs = new List<Vector2>();
		
		// Tileset id, Triangles List (each tileset = submesh)
		Dictionary<int,List<int>> submeshesTriangles = new Dictionary<int, List<int>>();
		
		float actualZ = 0;
		int triangleFaces = -1;
		
		for (int layerIdx = 0; layerIdx < layers.Count; layerIdx++)
		{	
			actualZ += _layerZ;
			TilelayerData layer = layers[layerIdx];
	
			for(int row = 1; row <= tilemapHeight; ++row)
			{
				for(int col = 0; col < tilemapWidth; ++col)
				{	
					// Get GID
					int gid = layer.gids[row-1,col];			
					if(gid == 0) continue;
					
					// Get tileset for this gid
					int tilesetId = tilesetIdToGid[gid];					
					TilesetData tileset = tilesets[tilesetId];
					int textureTilesPerRow = tileset.tilesPerRow;
					int firstGid = tileset.firstgid;
					float textureWidth = tileset.imagewidth;
					float textureHeight = tileset.imageheight;
					
					if(!submeshesTriangles.ContainsKey(tilesetId)) {
						submeshesTriangles.Add(tilesetId, new List<int>());
					}
					
					// Tile position
					Vector3 pos0 = new Vector3(col * scaleX, (-(tileHeight * row - anchorY) * scale), 0);		
			        Vector3 pos1 = pos0 + new Vector3(scaleX, scaleY, 0);	
					
					// Vertices
					Vector3 p0 = new Vector3(pos0.x, pos0.y, actualZ);
					Vector3 p1 = new Vector3(pos1.x, pos0.y, actualZ);
					Vector3 p2 = new Vector3(pos0.x, pos1.y, actualZ);
					Vector3 p3 = new Vector3(pos1.x, pos1.y, actualZ);
					
					vertices.Add(p0);
					vertices.Add(p1);
					vertices.Add(p2);
					vertices.Add(p3);
					
					// Triangles
					triangleFaces += 4;
					
					submeshesTriangles[tilesetId].Add(triangleFaces - 3);
					submeshesTriangles[tilesetId].Add(triangleFaces - 1);
					submeshesTriangles[tilesetId].Add(triangleFaces - 2);		
					submeshesTriangles[tilesetId].Add(triangleFaces - 2);
					submeshesTriangles[tilesetId].Add(triangleFaces - 1);
					submeshesTriangles[tilesetId].Add(triangleFaces);
					
					// UV
					int equivalentGidFromFirstRow = gid - firstGid + 1;
					int tilesRow = 1; 
					
					for(; equivalentGidFromFirstRow > (textureTilesPerRow); equivalentGidFromFirstRow -= (textureTilesPerRow)) {
						tilesRow++;
					}
					
					float tileX = ((equivalentGidFromFirstRow - 1) * (tileWidth + tileset.spacing)) + tileset.margin;
					float tileYBottomLeft = (((tileHeight + tileset.spacing) * tilesRow) - tileset.spacing) + tileset.margin;
			
					float pixelMinX = textureWidth;
					float pixelMinY = textureHeight;
					
					if(tileX != 0f) 			pixelMinX = tileX / pixelMinX;
					if(tileYBottomLeft != 0f)	pixelMinY = tileYBottomLeft / pixelMinY;
					
					Vector2 pixelMin = new Vector2(pixelMinX, 1.0f - pixelMinY);
					Vector2 pixelDims = new Vector2((tileWidth / textureWidth), (tileHeight / textureHeight));
					
					Vector2 min = pixelMin;
					
					// Amount of UV's have to match the amount of verts
					// And their winding.
					// Fix gaps with eps: http://forum.unity3d.com/threads/41187-Web-demo-of-my-2D-platformer?p=263666&viewfull=1#post263666				
					float eps = BleedingOffset;
					uvs.Add(min + new Vector2(pixelDims.x * 0.0f + eps, pixelDims.y * 0.0f + eps));
					uvs.Add(min + new Vector2(pixelDims.x * 1.0f - eps, pixelDims.y * 0.0f + eps));
					uvs.Add(min + new Vector2(pixelDims.x * 0.0f + eps, pixelDims.y * 1.0f - eps));
					uvs.Add(min + new Vector2(pixelDims.x * 1.0f - eps, pixelDims.y * 1.0f - eps));	
				}
			}
		
		} // end iterate layers	
		
		mesh.vertices = vertices.ToArray();
		mesh.uv = uvs.ToArray();
		
		// Only one tileset, no need for more than one submesh
		if(_amountTilesets == 1)
		{
			mesh.triangles = submeshesTriangles[0].ToArray();
		}
		// A submesh to each tileset
		else
		{
			mesh.subMeshCount = _amountTilesets;
			
			for (int tilesetId = 0; tilesetId < _amountTilesets; tilesetId++)
			{
				if(submeshesTriangles.ContainsKey(tilesetId)) {
					mesh.SetTriangles(submeshesTriangles[tilesetId].ToArray(), tilesetId);
				} else {
					mesh.SetTriangles(new int[0], tilesetId);
				}
			}
		}
		
		meshFilter.mesh = mesh;			
		
		mesh.RecalculateNormals();
		mesh.RecalculateBounds();
		mesh.Optimize();
		
		if(_generateMeshCollider)
		{
			meshCollider.sharedMesh = null;
			meshCollider.sharedMesh = mesh;
		}
		
		meshRenderer.materials = TilesetsMaterials;
	}
}