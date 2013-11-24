using UnityEngine;
using System.Collections;
using System.Text;
using System.IO;

public class loadCollisions : MonoBehaviour
{
	/*
	 * TODO: Transform is off, because it needs to account for the transform of the tilemap object.
	 * Should put all CollisionBox objects under a single object (preferably the one that has this script attached).
	 */
	public Transform collisionBoxPrefab;
	public TextAsset collisionFile;
	public float tileSize;	// Length of a tile in units.

	// Use this for initialization
	void Start () {
		Load("collisions.txt");
	}
	
	// Update is called once per frame
	void Update () {
	
	}



	
	private bool Load(string fileName)
	{
		// Handle any problems that might arise when reading the text
		try
		{
			string text = collisionFile.text;
			string[] lines = text.Split('\n');

			for (int i = 0; i < lines.Length; ++i)
			{
				string line = lines[i];
				string[] coordinates = line.Split (' ');
				Vector3 transform = new Vector3(System.Convert.ToSingle(coordinates[0]) * tileSize, System.Convert.ToSingle(coordinates[1]) * tileSize, 0);
				//GameObject box = (GameObject) Instantiate(collisionBoxPrefab, transform, Quaternion.identity);
				( (Transform) Instantiate(collisionBoxPrefab, transform + this.gameObject.transform.position, Quaternion.identity)).parent = this.gameObject.transform;
				//box.transform.parent = this.gameObject.transform;
			}
			return true;
		}
		
		// If anything broke in the try block, we throw an exception with information
		// on what didn't work
		catch (System.Exception e)
		{
			System.Console.WriteLine("{0}\n", e.Message);
			return false;
		}
	}

}
