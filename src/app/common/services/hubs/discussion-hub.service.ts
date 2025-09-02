import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { DiscussionPostDto } from '../../models/discussion-post.dto';
import { environment } from '../../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class DiscussionHubService {
  private hub!: HubConnection;
  newPost = signal<DiscussionPostDto | null>(null);
  private baseUrl = environment.apiUrl;
  connect(invId: string) {
    this.hub = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}hubs/discussion?invId=${invId}`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    this.hub.on('ReceivePost', (post: DiscussionPostDto) => {
      this.newPost.set(post);
    });

    this.hub
      .start()
      .catch((err) => console.error('SignalR connection error:', err));
  }

  disconnect() {
    this.hub?.stop();
  }
}
