#pragma strict

internal var playerScript : scr_Player;
internal var collided_with : GameObject; // detects collisions

function Start () {
	playerScript = GameObject.Find("obj_Player").GetComponent(scr_Player);
}

function OnTriggerEnter2D (col : Collider2D) {
	// save the collision
	collided_with = col.gameObject;
	
	if (collided_with.tag == "Player"){
		playerScript.ammo += 15; // add ammo
		playerScript.updateGUI(); // update gui
		Destroy(gameObject); // destroy self
	}
}