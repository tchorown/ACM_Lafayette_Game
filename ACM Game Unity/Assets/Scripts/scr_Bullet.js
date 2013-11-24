#pragma strict
var speed : int;
var xDir : int;
var yDir : int;
enum Source { Player, Ally, Enemy, Environment } // specifies the source
var damageSource : Source;
var attack : int; // likelyhood that the bulelt will hit
var damage : int; // damage of bullet
var player : GameObject;
var playerScript : scr_Player;
var collided_with : GameObject; // detects collisions
var horizDir : int;
var vertDir : int;

function Start (){
	// access the player's script
	playerScript = GameObject.Find("obj_Player").GetComponent(scr_Player);
	
	// pull in components from the player
	horizDir = playerScript.right - playerScript.left;
	vertDir = playerScript.up - playerScript.down;
	
	// use directional values to move the bullet just off the edge of the player.  This way, it won't be created at the player's origin.
	transform.Translate(Vector2(.75*horizDir,.75*vertDir));
	
	// self-destruct after 1 second.  "gameObject" refers to the object assosiated with this script
	Destroy(gameObject,1);
}

function Update () {
	// move at the given speed in a certain direction
	transform.Translate(Vector2(horizDir*speed * Time.deltaTime,vertDir*speed * Time.deltaTime));
}

// destroy on collision
function OnCollisionEnter2D(col : Collision2D){
	//Debug.Log("Much bullets very collide!");
	// save the collision
	collided_with = col.gameObject;
	
	// read tag of collided object
	if (collided_with.tag == "FullCollision") {
		// destroy self
		Destroy(gameObject);
	}
}