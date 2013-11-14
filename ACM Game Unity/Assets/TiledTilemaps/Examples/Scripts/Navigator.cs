using UnityEngine;
using System.Collections;

public class Navigator : MonoBehaviour {
	public int nextScene;
	
	void OnGUI() {
	    if (GUI.Button(new Rect(880, 20, 50, 30), "Next"))
	        Application.LoadLevel(nextScene);
	    
	}
}
