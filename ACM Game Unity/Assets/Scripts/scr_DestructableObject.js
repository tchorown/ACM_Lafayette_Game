#pragma strict
var bulletScript : scr_Bullet; // the script of the bullet
var collided_with : GameObject; // detects collisions
var maxHealth : int; // start health
var currentHealth : int; // current health
var armor : int; // resistance to damage

function Start () {
	currentHealth = maxHealth;
}

function Update () {
	// die if health is below 1
	if (currentHealth <= 0) {
		Destroy(gameObject);
	}
}

function OnCollisionEnter2D(col : Collision2D){
		// save the collision
	collided_with = col.gameObject;
	
	// read tag of collision
	switch (collided_with.tag) {
		case "Projectile" :
			Debug.Log("Tower hit!");
			bulletScript = collided_with.GetComponent(scr_Bullet);
			
			// calculate a hit or miss by checking to see if the bullet comes from the player AND it gets past the armor raiting
			if (bulletScript.attack + Random.Range(0,4) > armor && bulletScript.damageSource == Source.Player){
				// decrease health
				currentHealth -= bulletScript.damage + Random.Range(0,2);
			}
			
			// destroy bullet
			Destroy(collided_with);
			break; 
	}
}