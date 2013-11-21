#pragma strict
// A script that subdivides the play area
private var gameWidth : double;
private var gameHeight : double;
function Start () 
{
	//get width and height of map
	gameWidth = GameObject.Find("obj_Player").renderer.bounds.max.x;
	gameHeight = GameObject.Find("obj_Player").renderer.bounds.max.y;
	//create grid overlay
	for(var i:int = 0; i<gameWidth; i++)
	{
		for(var j:int = 0; j<gameHeight; j++)
		{
			
		}
	}
	//calculate path
	//return the path

}

function Update () 
{

}