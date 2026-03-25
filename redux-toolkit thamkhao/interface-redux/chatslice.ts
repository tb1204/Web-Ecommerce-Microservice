// ============================================================
// chatSlice.ts
// Quản lý UI state của chat:
//   - activeConversationId: phòng đang mở
//   - typing indicators
//   - WebSocket messages được append vào RTK Query cache
// ============================================================
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { MessageResponse, ConversationResponse } from "./types";
import { api } from "./api";

interface ChatState {
  activeConversationId: string | null;
  typingUserIds: string[]; // clerkId đang gõ
  isConnected: boolean; // WebSocket connected?
  unreadCount: number; // badge header
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    activeConversationId: null,
    typingUserIds: [],
    isConnected: false,
    unreadCount: 0,
  } as ChatState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },

    setWsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },

    /** Gọi khi nhận sự kiện "typing" từ WS */
    addTypingUser(state, action: PayloadAction<string>) {
      if (!state.typingUserIds.includes(action.payload)) {
        state.typingUserIds.push(action.payload);
      }
    },

    removeTypingUser(state, action: PayloadAction<string>) {
      state.typingUserIds = state.typingUserIds.filter(
        (id) => id !== action.payload,
      );
    },

    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },

    incrementUnread(state) {
      state.unreadCount += 1;
    },

    resetUnread(state) {
      state.unreadCount = 0;
    },
  },
});

export const {
  setActiveConversation,
  setWsConnected,
  addTypingUser,
  removeTypingUser,
  setUnreadCount,
  incrementUnread,
  resetUnread,
} = chatSlice.actions;

// ─── Selectors ───────────────────────────────────────────────
export const selectActiveConversationId = (state: RootState) =>
  state.chat.activeConversationId;
export const selectTypingUserIds = (state: RootState) =>
  state.chat.typingUserIds;
export const selectWsConnected = (state: RootState) => state.chat.isConnected;
export const selectUnreadCount = (state: RootState) => state.chat.unreadCount;

// ─── Helper: append tin nhắn WS vào RTK Query cache ─────────
// Gọi từ WebSocket handler: dispatch(appendWebSocketMessage(message))
export const appendWebSocketMessage =
  (message: MessageResponse) => (dispatch: AppDispatch) => {
    dispatch(
      api.util.updateQueryData(
        "getMessages",
        message.conversationId,
        (draft) => {
          // Không append nếu đã có (idempotent)
          if (!draft.find((m) => m.id === message.id)) {
            draft.push(message);
          }
        },
      ),
    );
  };

// Update conversation preview (lastMessage) khi nhận WS
export const updateConversationPreview =
  (message: MessageResponse) => (dispatch: AppDispatch) => {
    dispatch(
      api.util.updateQueryData("getMyConversations", undefined, (draft) => {
        const conv = draft.find((c) => c.id === message.conversationId);
        if (conv) {
          conv.lastMessage = message.content ?? "";
          conv.lastMessageAt = message.createdAt;
          conv.lastSenderRole = message.senderRole;
        }
      }),
    );
    // Admin view
    dispatch(
      api.util.updateQueryData(
        "getConversationsByStatus",
        "ACTIVE",
        (draft) => {
          const conv = draft.find((c) => c.id === message.conversationId);
          if (conv) {
            conv.lastMessage = message.content ?? "";
            conv.lastMessageAt = message.createdAt;
          }
        },
      ),
    );
  };

// AppDispatch type — import từ store để tránh circular
import type { AppDispatch } from "./store";

export default chatSlice.reducer;
